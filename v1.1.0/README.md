# IIR — Integrated Independent Research · v2.3.0

S00의 논지를 여섯 흐름으로 읽고, Paper 바탕의 지도·개념 설명과 실제 자료 폴더를 탐색하는 연구 에세이입니다. 13개 연구와 한·영 병렬 자료실을 보존합니다. 선 중심 SVG, 로컬 폰트, Next.js·React·TypeScript·CSS를 사용합니다.

## 실행

Node.js 24.x와 npm을 사용합니다. 공개 HTML·PDF는 API 키 없이 읽을 수 있습니다. 비공개 보존 원본은 기존 Supabase Free에 따로 저장합니다.

```sh
cd v1.1.0
npm ci
npm run dev
```

프로덕션은 `npm run build` 후 `npm run start`입니다. Vercel Root Directory는 `v1.1.0`이며, 버전은 package와 Git 태그로 구분합니다.

## 구성

- `/`: S00 중심 18개 연결 논지, 미국·중국·한국의 구체 사례, 사례마다 연결된 지도·관계도와 세 전체 폭 강조 장면. 강제 스냅·휠 가로채기·정지 상태 애니메이션 루프가 없습니다.
- `/archive`: 실제 연구 13개의 폴더·두 줄 서가, 선택·열기·Esc 취소·검색·주제 필터·목록 보기.
- `/library`: 실제 참고자료 4개를 폴더·도서 책등으로 탐색. 원문 미확보 도서는 상태와 상세 정보만 제공.
- `/reports`: 기존 원문 목록과 검색·주제 필터.
- `/reports/[id]`: 한국어·영어 전문 973개 대응 문단, 원문 위치·기존 주소·핵심 강조·메인 복귀. 넓은 화면은 병렬, 좁은 화면은 언어 전환을 지원합니다.
- 본문 하단 PDF: 펼칠 때만 자체 호스팅 PDF.js를 로드합니다. 한 번에 한 쪽을 렌더링하며 쪽 이동·확대·전체화면·다운로드를 지원합니다. JavaScript 없이도 양쪽 전문과 다운로드가 남습니다.
- 기존 `/archive/[slug]`, `/research/[slug]`, `/library`와 공개 API를 유지합니다. 이전 계획 발췌문의 번역 상태는 실제 연구의 편집 번역과 구분합니다.

## 콘텐츠와 보존

`src/content/reports/`는 기존 추출 자료입니다. 별도 `readings/`에 좌표 기반 읽기 순서·문단·출처 참조를, `translations/`에 한국어 지문 해시와 영어 전문을 저장합니다. `reading-tables.ts`는 원본과 대조한 표를, `essay.ts`와 `research-connections.ts`는 논지·연결·출처를 관리합니다. 공통 디자인은 `tokens.css`, 새 스크롤·서가 배치는 `story.css`, 장면은 `essay-experience.tsx`, 자료 모형은 `material-shelf.tsx`에 있습니다. `src/visuals/`의 표기·지도 geometry는 연구 원문과 분리합니다. 정지 상태나 포인터 이동으로 화면을 흔들지 않습니다.

한국어는 표현을 재작성하지 않고 서식을 복원했습니다. 영어는 **편집 번역·저자 최종 검수 전**입니다. 지문 해시·문자 보존 검사는 의미 검수나 연구 결과 재현을 대신하지 않습니다. 공식 자료에 접근하지 못한 외부 근거와 원문의 미검증 주장을 확정 사실로 제시하지 않습니다. [현재 구현·검증 기록](docs/V2_3_RELEASE.md)을 참고하세요.

원본·기존 개인정보 제거 PDF의 바이트와 해시는 유지했습니다. 원본 바이너리·개인정보·인증정보·작업용 파일은 Git에 넣지 않습니다. 읽기본을 재생성하면 문단 ID와 번역 해시가 바뀔 수 있으므로 무심코 덮어쓰지 마세요.

## 검증

```sh
npm test
npm run audit:readings
npm run typecheck
npm run format:check
npm run build
# 별도 터미널에서 npm run start -- --port 3001
CHROME_PATH=/usr/bin/chromium E2E_BASE_URL=http://127.0.0.1:3001 npm run test:e2e
CHROME_PATH=/usr/bin/chromium AUDIT_URL=http://127.0.0.1:3001 npm run audit:performance
python3 -m unittest discover -s tests -p 'test_*.py' -v
```

`CHROME_PATH`를 생략하면 Playwright 관리 브라우저를 사용합니다. 필요하면 `npx playwright install chromium`을 실행합니다. 문서 전처리 전용 Python 의존성은 `scripts/requirements-reports.txt`에 있으며 웹 실행에는 필요하지 않습니다.

[무료 운영](docs/FREE_LAUNCH.md) · [Open Design 이관](docs/DESIGN_HANDOFF.md) · [변경 기록](docs/CHANGELOG.md) · [이전 v2.0.0 검증](docs/V2_RELEASE.md)

## v2.3.0 읽기와 그래픽

본문 순서와 원문을 유지하며 18개 사례별 그림·제목·범례·출처를 한 단위로 제공합니다. Pretext 1.0.0으로 HTML 지명과 연결문을 측정합니다. 세 강조 장면, 클릭·키보드 설명, 전문용어 풀이, 원문 문단 왕복, 국가별 비교를 추가했습니다.

`npm run audit:preservation`은 v2.2.0 기준 원문·번역·API·백엔드와 PDF 해시를 검사합니다. `npm run test:e2e`는 Chromium에서 반응형·조작 회귀를, `npm run audit:performance`는 운영 빌드의 모바일 Lighthouse 3회 중앙값을 측정합니다. 실제 결과와 미완료 범위는 [v2.3.0 기록](docs/V2_3_RELEASE.md)을 따릅니다.
