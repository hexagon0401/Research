#!/usr/bin/env python3
"""Create readable editions without changing the source transcription or PDF.

PDF glyphs are ordered by baseline and x coordinate, rather than PDF object order.
This matters for punctuation and Latin runs embedded inside Korean text spans.
Only whitespace/layout is normalized. Translations live in separate, resumable files.
"""
import argparse
import hashlib
import json
import re
import statistics
from pathlib import Path

import fitz
from kiwipiepy import Kiwi

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "src/content"
KIWI = Kiwi(num_workers=2)
for term in ["레드불", "몬스터", "알류미늄", "충진", "조원", "지속가능성", "기술독점", "온톨로지", "팔란티어", "안듀릴", "스테이블코인", "그린란드", "골든돔", "프린스", "반사실", "하이닉스"]:
    KIWI.add_user_word(term, "NNP", 10)


def clean(text):
    text = text.replace("\u200b", "").replace("\ufeff", "")
    text = re.sub(r"[\t\u00a0\u2002-\u200a]+", " ", text)
    text = re.sub(r" {2,}", " ", text)
    text = re.sub(r"\s+([,.;:!?%)\]】])", r"\1", text)
    text = re.sub(r"([(\[【])\s+", r"\1", text)
    return text.strip()


def readable_chunks(text):
    # Do not re-space the author's prose. Only physical line boundaries are
    # repaired by join_line; this preserves names, spelling and original wording.
    if len(text) < 650:
        return [text]
    sentences = KIWI.split_into_sents(text)
    chunks = []
    start = 0
    last = 0
    for sentence in sentences:
        if last > start and sentence.end - start > 550:
            chunks.append(text[start:last].strip())
            start = sentence.start
        last = sentence.end
    if text[start:].strip():
        chunks.append(text[start:].strip())
    return chunks


def physical_lines(page):
    chars = []
    for block in page.get_text("rawdict")["blocks"]:
        for line in block.get("lines", []):
            for span in line["spans"]:
                for char in span["chars"]:
                    chars.append((char["origin"][1], char["origin"][0], char["c"], char["bbox"]))
    groups = []
    for y, x, c, box in sorted(chars):
        if not groups or abs(y - groups[-1]["y"]) > 2.4:
            groups.append({"y": y, "chars": []})
        groups[-1]["chars"].append((x, c, box))
    output = []
    for group in groups:
        row = sorted(group["chars"], key=lambda item: item[0])
        text = ""
        last_right = None
        for x, c, box in row:
            # Explicit source spaces are retained; infer only visibly separate runs.
            if last_right is not None and x - last_right > 2.5 and text and not text[-1].isspace() and not c.isspace():
                text += " "
            text += c
            last_right = box[2]
        if clean(text):
            output.append({"y": group["y"], "x": row[0][0], "text": clean(text), "trailingSpace": text.endswith(" ")})
    return output


def join_line(previous, current, trailing):
    if not previous:
        return current
    if re.search(r"https?://\S+$", previous) and re.fullmatch(r"[A-Za-z0-9_/?%&=.#-]+", current) and (re.search(r"[/%_-]$", previous) or re.search(r"[/%_.-]", current)):
        return previous + current
    if not trailing and re.search(r"[가-힣]$", previous) and re.match(r"^[가-힣]", current):
        glued = KIWI.glue([previous, current])
        if re.sub(r"\s", "", glued) == re.sub(r"\s", "", previous + current):
            return clean(glued)
    # Source line wraps inside Korean words commonly preserve no trailing space.
    suffix = r"^(?:다는|하는|하지|하여|하고|하며|지만|으므로|으로|에서|에게|이다|이나|으며|거나|도록|었다|았다|된다|된다|되지|지는|에도|까지|보다|라는|라고|처럼|의\s|을\s|를\s|은\s|는\s|에\s|과\s|와\s|이\s|가\s|다[. ,])"
    separator = "" if not trailing and re.search(r"[가-힣]$", previous) and re.match(suffix, current) else " "
    return clean(previous + separator + current)


def page_paragraphs(page):
    lines = physical_lines(page)
    if not lines:
        return []
    gaps = [b["y"] - a["y"] for a, b in zip(lines, lines[1:]) if 5 < b["y"] - a["y"] < 35]
    leading = statistics.median(gaps) if gaps else 15
    paras = []
    text = ""
    previous = None
    list_start = re.compile(r"^(?:\d+[.)]\s|[ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ]+[.\s]|[IVX]+[-.][IVX]+|[①②③④⑤⑥⑦⑧⑨⑩]|[•●▪])")
    for line in lines:
        value = line["text"]
        # Running page numbers remain represented by the source page locator.
        if line["y"] > page.rect.height * .94 and re.fullmatch(r"[-–—]?\s*\d+\s*[-–—]?", value):
            continue
        boundary = previous and (line["y"] - previous["y"] > leading * 1.45 or list_start.match(value))
        if boundary and text:
            paras.append(text)
            text = ""
        text = join_line(text, value, previous["trailingSpace"] if previous else True)
        previous = line
    if text:
        paras.append(text)
    return paras


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("ids", nargs="*")
    args = parser.parse_args()
    out = CONTENT / "readings"
    out.mkdir(exist_ok=True)
    for path in sorted((CONTENT / "reports").glob("s*.json")):
        report = json.loads(path.read_text())
        rid = report["id"]
        if args.ids and rid not in args.ids:
            continue
        pdf = fitz.open(ROOT / "public" / report["readerUrl"].lstrip("/")) if report["locator"] == "page" else None
        paragraphs = []
        for section in report["sections"]:
            if pdf:
                texts = page_paragraphs(pdf[section["number"] - 1])
                items = [(t, [b["id"] for b in section["blocks"]], "body") for t in texts]
            else:
                items = []
                for block in section["blocks"]:
                    for t in re.split(r"\n\s*\n|\u2028\s*\u2028|\u2029", block["text"]):
                        if clean(t):
                            items.append((clean(re.sub(r"\s*[\n\u2028]\s*", " ", t)), [block["id"]], block["kind"]))
            items = [(chunk, refs, kind) for text, refs, kind in items for chunk in readable_chunks(text)]
            for number, (text, refs, kind) in enumerate(items, 1):
                paragraphs.append({"id": f"{rid}-R{section['number']:03d}-P{number:03d}", "sectionId": section["id"], "sourceBlockIds": refs, "sourcePage": section["number"] if pdf else None, "kind": kind, "ko": text, "sourceTextSha256": hashlib.sha256(text.encode()).hexdigest()})
        # Visually checked continuations: neither the author nor the word changes
        # at a page break. Both source anchors continue to resolve to the passage.
        continuations = {
            "S01": {"S01-R001-P010": "S01-R002-P002", "S01-R002-P008": "S01-R003-P002"},
            "S03": {"S03-R001-P002": "S03-R001-P003", "S03-R002-P006": "S03-R003-P002", "S03-R003-P006": "S03-R004-P002"},
            "S06": {"S06-R004-P006": "S06-R005-P001", "S06-R006-P005": "S06-R007-P001"},
            "S08": {"S08-R001-P010": "S08-R002-P001", "S08-R003-P006": "S08-R004-P001"},
            "S13": {"S13-R002-P010": "S13-R003-P001", "S13-R004-P009": "S13-R005-P001"},
            "S16": {"S16-R002-P007": "S16-R003-P002"},
        }.get(rid, {})
        for first, following in continuations.items():
            a = next((p for p in paragraphs if p["id"] == first), None)
            b = next((p for p in paragraphs if p["id"] == following), None)
            if a and b:
                a["ko"] = a["ko"] + ("" if rid in {"S01", "S06", "S16"} else " ") + b["ko"]
                a["sourceBlockIds"] = list(dict.fromkeys(a["sourceBlockIds"] + b["sourceBlockIds"]))
                a["sourcePageEnd"] = b["sourcePage"]
                a["sourceTextSha256"] = hashlib.sha256(a["ko"].encode()).hexdigest()
                paragraphs.remove(b)
        edition = {"reportId": rid, "revision": "reading-002", "editing": "layout-only", "translationStatus": "pending", "paragraphs": paragraphs}
        target = out / path.name
        target.write_text(json.dumps(edition, ensure_ascii=False, indent=2) + "\n")
        print(rid, len(paragraphs), "reading paragraphs")


if __name__ == "__main__":
    main()
