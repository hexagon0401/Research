# IIR — Interactive Research Atlas · v1.1.0

지정된 Paper / Ink / Signal과 로컬 Geist·IBM Plex 폰트를 유지한 디자인 개선본입니다. 기존 Next.js·React·TypeScript·SVG·CSS 구조와 연구 콘텐츠를 보존합니다.

## 실행

Node.js 22.9 이상과 npm을 사용합니다. 외부 서비스나 API 키가 필요하지 않습니다.

```sh
cd v1.1.0
npm ci
npm run dev
```

브라우저에서 http://localhost:3000 을 엽니다. 프로덕션 실행은 `npm run build` 후 `npm run start`입니다. 다른 포트는 `npm run dev -- --port 3001`로 지정합니다.

## 개선 사항

- 대형 제목과 개념 그래픽을 분리한 편집형 첫 화면.
- 국가 선택과 설명이 연결되는 선형 아틀라스, 읽기 쉬운 가설·경계 조건 도식.
- 사선 시점의 폴더 서가, 종이층·표지 열기, Esc 취소, 선택 복원, 방향키·Home·End 탐색.
- 정돈된 문서 리더·출처 레일·검색·필터·검증 상태.
- 모바일·키보드·모션 감소·No-JS·인쇄 경로. 무거운 WebGL 의존성은 추가하지 않았습니다.

홈 `/`, 아카이브 `/archive`, 문서 `/archive/[slug]`, 연구 `/research/[slug]`, 참고문헌 `/library`, 방법 `/methods`, 소개 `/about`, 접근성 `/accessibility`와 공개 읽기 API를 유지합니다.

## 검증 명령

```sh
npm test
npm run typecheck
npm run format:check
npm run build
# 별도 터미널에서 npm run start
npm run test:e2e
npm run audit:performance
```

E2E는 Playwright 관리 Chromium을 기본 사용합니다. 필요하면 `npx playwright install chromium`으로 설치합니다. 기존 Chrome을 사용할 때는 `CHROME_PATH`에 실행 파일 경로를 지정합니다. 성능 계측도 `CHROME_PATH`를 지원합니다. 실행 결과와 제한은 [검증 기록](docs/VALIDATION.md)에 기록합니다. v1.0.0의 스크린샷과 성능 수치를 새 버전 결과로 재사용하지 않습니다.

## 콘텐츠와 공개 범위

`src/content/research.json`과 `map.json`은 v1.0.0과 동일합니다. `P-001`–`P-006`, `CLAIM-01`–`CLAIM-06`, 출처 위치와 URL을 보존합니다. EN은 UI 언어이며, 검수 연구 번역이 없어 문서에서는 한국어와 Translation pending 안내를 유지합니다.

실제 원문·수치 데이터·코드·번역·공개 권한을 새로 확보하거나 연구 결과를 검증한 버전이 아닙니다. noindex와 기존 공개 범위를 유지합니다. Supabase·Oracle·Foundry 연동, 풀 3D 카메라 전환, 실제 서비스 배포는 포함하지 않습니다.

- [디자인 결정](docs/DECISIONS.md)
- [변경 기록](docs/CHANGELOG.md)
- [검증 기록](docs/VALIDATION.md)
- [기존 콘텐츠 감사](docs/CONTENT_AUDIT.md)
- [구현 범위](docs/IMPLEMENTATION_STATUS.md)
