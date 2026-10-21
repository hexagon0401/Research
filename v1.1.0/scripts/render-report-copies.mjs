// Reflow XML documents as tagged, de-identified reading PDFs. No external fetches.
import { chromium } from "@playwright/test";
import { readFile, writeFile, chmod } from "node:fs/promises";
import path from "node:path";
const manifest = JSON.parse(await readFile(process.argv[2], "utf8"));
const escape = (text) =>
  String(text).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || "/usr/bin/chromium",
  headless: true,
});
try {
  for (const entry of manifest.reports) {
    if (entry.source.endsWith(".pdf")) continue;
    const directory = path.join(path.dirname(entry.source), "publication");
    const report = JSON.parse(
      await readFile(path.join(directory, "prepared.json"), "utf8"),
    );
    let content = report.sections
      .flatMap((s) => s.blocks)
      .map(
        (b) =>
          `<section class="${b.kind}"><span class="ref">${escape(b.id)}${b.kind === "memo" ? " · 원문 메모" : b.kind === "note" ? " · 원문 각주" : ""}</span><p>${escape(b.text)}</p></section>`,
      )
      .join("");
    for (const figure of report.media || []) {
      const data = await readFile(path.join(directory, figure.file));
      content += `<figure><img src="data:image/png;base64,${data.toString("base64")}" alt="${escape(figure.alt)}"><figcaption>${escape(figure.alt)} · DOCX에 포함된 그림, 서식 재배치</figcaption></figure>`;
    }
    const html = `<!doctype html><html lang="ko"><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:"><title>${escape(report.id)} — ${escape(report.title)}</title><style>html{font-family:"Noto Sans CJK KR",sans-serif;color:#202527}body{font-size:10pt;line-height:1.8;margin:0}h1{font-size:20pt;line-height:1.5}p{white-space:pre-wrap;overflow-wrap:anywhere;margin:3px 0 15px;orphans:3;widows:3}header{border-top:3px solid #2b7169;padding:18px 0;margin-bottom:20px}header p,figcaption{font-size:9pt;color:#435352}.ref{display:block;font-size:7pt;color:#687b78;break-after:avoid}.memo,.note{border-left:2px solid #2b7169;padding-left:12px;font-size:9pt}figure{break-inside:avoid;margin:24px 0}img{max-width:100%;height:auto}</style><header><span class="ref">${escape(report.id)} / rev-001 / 개인정보 제거 열람본</span><h1>${escape(report.title)}</h1><p>HWPX/DOCX의 문단·표·메모·각주를 추출해 재구성한 사본입니다. 원래 페이지와 서식을 재현하지 않습니다. 학교·학번·작성자·교사 식별정보와 학교 로고를 제외했습니다. 원문의 수치·주장·초안 및 서식 지시문은 연구 결과로 재해석하거나 수정하지 않았습니다.</p></header>${content}</html>`;
    const page = await browser.newPage();
    await page.route(/^https?:/, (r) => r.abort());
    await page.setContent(html, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({
      path: path.join(directory, "reader.pdf"),
      format: "A4",
      printBackground: true,
      tagged: true,
      displayHeaderFooter: true,
      headerTemplate: "<span></span>",
      footerTemplate: `<div style="width:100%;text-align:center;font:8px sans-serif;color:#687b78">${escape(report.id)} / rev-001 · <span class="pageNumber"></span> / <span class="totalPages"></span></div>`,
      margin: { top: "14mm", right: "16mm", bottom: "16mm", left: "16mm" },
    });
    await chmod(path.join(directory, "reader.pdf"), 0o600);
    await writeFile(path.join(directory, "reader.html"), html, { mode: 0o600 });
    await page.close();
    console.log(
      JSON.stringify({
        id: report.id,
        readingCopy: "created",
        state: "private-candidate",
      }),
    );
  }
} finally {
  await browser.close();
}
