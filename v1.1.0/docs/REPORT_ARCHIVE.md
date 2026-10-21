# 원문 자료실 — 1.1.2

2026-10-22 (Asia/Seoul). 13개 서로 다른 원본 파일을 해시로 보존하고, 개인정보를 제거한 웹 전사본과 PDF 열람본을 만들었다. 원문 확보와 연구 주장 검증은 별개다.

| 자료 | 형식    | 구분                                  |
| ---- | ------- | ------------------------------------- |
| S00  | HWPX    | 통합 초안                             |
| S01  | PDF     | 사이버 안보·NCW·MDO                   |
| S02  | DOCX    | 경제–안보 복합체                      |
| S03  | PDF 5쪽 | Golden Dome 계획서                    |
| S05  | DOCX    | 금융 신뢰·스테이블코인                |
| S06  | PDF     | 세미나 결과·분석·피드백               |
| S08  | PDF     | 다중스케일 지역탐구                   |
| S11  | PDF     | 파라벨룸·동맹·기업                    |
| S13  | PDF 6쪽 | 별도 Golden Dome 자료                 |
| S14  | PDF     | 현대사회와 철학·온톨로지              |
| S15  | PDF     | 동북아 공간 데이터 탐구               |
| S16  | PDF     | 반도체 수출통제, 기존 S10과 다른 자료 |
| S17  | PDF     | PCA·VAR·군집 분석                     |

S04·S07·S09·S10·S12는 여전히 미제공이다. S00 재첨부는 이전 원본과 해시가 같아 중복 원문을 새 연구로 세지 않았다. 원본 파일명과 개인정보 제거 목록은 Git에서 제외한 `.local`에만 기록한다.

## 보관과 제공

- 수정하지 않은 원본: `.local/intake/<sha256>/original.*`, Supabase `research-originals` 비공개 버킷. 익명 공개 대상이 아니다.
- 개인정보 제거 PDF: `research-reader` 비공개 버킷 및 버전 경로의 공개 정적 사본. 정적 사본은 검토한 PDF만 포함하며 원본·키·개인정보를 Git에 넣지 않는다.
- 웹 전문: `/reports`, `/reports/[id]`; API `/api/public/reports`, `/api/public/reports/[id]`.
- 출처 위치: PDF의 실제 쪽, XML 문서의 문단 묶음. HWPX/DOCX의 원래 페이지·서식을 재현했다고 주장하지 않는다.
- PDF 안 이미지의 글자를 임의 전사하지 않는다. 해당 쪽 WebP 미리보기와 PDF에서 도표를 확인할 수 있다. 그래프는 원문에 보고된 결과이며 재현 검증 결과가 아니다.
- 메인에서는 PDF·도표를 미리 내려받지 않는다. 보고서 전문은 서버 렌더링하고 목록에는 메타데이터만 전달한다. 이미지 최적화 유료 기능 없이 미리 만든 WebP를 지연 로드한다.

공개용 파일은 학교·학번·작성자·교사·동료 식별정보를 제거하고 PDF 메타데이터·첨부·스크립트를 정리했다. 원본을 덮어쓰지 않았다. 원문의 주장을 사실 검증 결과로 승격하거나 공동 활동을 단독 연구로 바꾸지 않았다.

## 재생성

```sh
python3 -m pip install -r scripts/requirements-reports.txt
python3 scripts/report-documents.py .local/reports-input.json
node scripts/render-report-copies.mjs .local/reports-input.json
python3 scripts/finalize-report-candidates.py .local/reports-input.json --export-reading-pdfs
```

비공개 manifest는 원본 경로·실제 개인정보 제거 목록·확인한 이미지 목록을 포함하므로 커밋하지 않는다. 공개 JSON에는 원본 경로·원본 파일명·스토리지 경로·키를 넣지 않는다. 텍스트 추출에 문서 내 지시문이나 스크립트를 실행하는 기능은 없다.

실제 업로드: `python3 scripts/publish-reports.py .local/reports-input.json`. URL과 서버 키는 보안 환경에서만 읽는다. 두 버킷의 비공개 여부와 메타데이터 권한을 먼저 확인하고, 덮어쓰기 없이 업로드하며, 원격 파일과 실제 5분 서명 다운로드의 SHA-256을 확인한 뒤 열람본 메타데이터를 게시한다. 로그에 키·서명 URL을 기록하지 않는다. 재실행 시 같은 해시만 재사용하며 다른 파일은 덮어쓰지 않는다.

## 검증

`npm test`, `python3 -m unittest discover -s tests -p 'test_*.py' -v`, `CHROME_PATH=/usr/bin/chromium npm run test:e2e`를 사용한다. 원본 13개와 PDF 13개의 해시, XML 모든 문단의 PDF 포함, 공개 자료의 식별정보·키 패턴, 출처 ID·locator·별도 파일의 동일성 오인을 검사한다. 실제 클라우드 결과는 비공개 `.local/cloud-reports-verification.json`에 실행 결과로 기록한다. 이 파일을 만들지 못한 작업을 업로드 성공으로 표시하지 않는다.
