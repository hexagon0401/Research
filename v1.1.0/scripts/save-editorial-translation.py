#!/usr/bin/env python3
"""Checkpoint translated paragraphs with the exact Korean edition fingerprint."""
import argparse
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument("report")
parser.add_argument("input", type=Path)
args = parser.parse_args()
name = args.report.lower()
reading = json.loads((ROOT / f"src/content/readings/{name}.json").read_text())
source = {p["id"]: p for p in reading["paragraphs"]}
path = ROOT / f"src/content/translations/{name}.json"
result = json.loads(path.read_text()) if path.exists() else {"reportId": reading["reportId"], "method": "editorial-translation", "status": "author-review-pending", "paragraphs": {}}
entries = json.loads(args.input.read_text())
for pid, english in entries.items():
    if pid not in source or not isinstance(english, str) or not english.strip():
        raise ValueError(f"Invalid translation paragraph: {pid}")
    result["paragraphs"][pid] = {"sourceTextSha256": source[pid]["sourceTextSha256"], "en": english.strip()}
result["complete"] = all(result["paragraphs"].get(pid, {}).get("sourceTextSha256") == p["sourceTextSha256"] for pid, p in source.items())
result["translatedCount"] = sum(result["paragraphs"].get(pid, {}).get("sourceTextSha256") == p["sourceTextSha256"] for pid, p in source.items())
result["sourceCount"] = len(source)
path.parent.mkdir(exist_ok=True)
path.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
print(reading["reportId"], result["translatedCount"], "/", result["sourceCount"], "complete:", result["complete"])
