# IIR — Integrated Independent Research · v2.1.0

S00의 논지를 중심으로 13개 연구를 연결하는 장문 에세이와 한·영 병렬 자료실입니다. 선 중심 SVG, 로컬 폰트, Next.js·React·TypeScript·CSS를 사용합니다.

## 실행

Node.js 24.x와 npm을 사용합니다. 공개 HTML·PDF는 API 키 없이 읽을 수 있습니다. 비공개 보존 원본은 기존 Supabase Free에 따로 저장합니다.

```sh
cd v1.1.0
npm ci
npm run dev
```

프로덕션은 `npm run build` 후 `npm run start`입니다. Vercel Root Directory는 `v1.1.0`이며, 버전은 package와 Git 태그로 구분합니다.

## 구성

- `/`: S00 중심 18개 연결 논지, 미국·중국·한국의 구체 사례, 스크롤에 따라 이어지는 공통 시각 영역. 강제 스냅·휠 가로채기·정지 상태 애니메이션 루프가 없습니다.
- `/archive`, `/reports`: 실제 연구 13개 검색·주제 필터.
- `/reports/[id]`: 한국어·영어 전문 973개 대응 문단, 원문 위치·기존 주소·핵심 강조·메인 복귀. 넓은 화면은 병렬, 좁은 화면은 언어 전환을 지원합니다.
- 본문 하단 PDF: 펼칠 때만 자체 호스팅 PDF.js를 로드합니다. 한 번에 한 쪽을 렌더링하며 쪽 이동·확대·전체화면·다운로드를 지원합니다. JavaScript 없이도 양쪽 전문과 다운로드가 남습니다.
- 기존 `/archive/[slug]`, `/research/[slug]`, `/library`와 공개 API를 유지합니다. 이전 계획 발췌문의 번역 상태는 실제 연구의 편집 번역과 구분합니다.

## 콘텐츠와 보존

`src/content/reports/`는 기존 추출 자료입니다. 별도 `readings/`에 좌표 기반 읽기 순서·문단·출처 참조를, `translations/`에 한국어 지문 해시와 영어 전문을 저장합니다. `reading-tables.ts`는 원본과 대조한 표를, `essay.ts`와 `research-connections.ts`는 논지·연결·출처를 관리합니다. 디자인은 `tokens.css`, 배치·시각 효과는 CSS와 `essay-experience.tsx`로 구분합니다.

한국어는 표현을 재작성하지 않고 서식을 복원했습니다. 영어는 **편집 번역·저자 최종 검수 전**입니다. 지문 해시·문자 보존 검사는 의미 검수나 연구 결과 재현을 대신하지 않습니다. 공식 자료에 접근하지 못한 외부 근거와 원문의 미검증 주장을 확정 사실로 제시하지 않습니다. [현재 구현·검증 기록](docs/V2_1_RELEASE.md)을 참고하세요.

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
