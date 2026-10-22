# v1.1.0 검증 기록

현재 v2.0.0의 실제 통과 결과와 성능은 [v2.0.0 검증 기록](V2_RELEASE.md)을 따른다. 아래는 v1.1.0 작성 당시 macOS 환경의 역사적 기록이며 현재 클라우드 브라우저 검사 결과와 구분한다.

실행일: 2026-10-21. macOS, Node.js 22.22.3, npm 10.9.8, 저장소 lockfile 의존성. v1.0.0의 검증 수치와 화면은 이번 결과로 재사용하지 않았습니다.

## 완료한 검사

| 검사                  | 실제 결과                                                    |
| --------------------- | ------------------------------------------------------------ |
| `npm ci`              | 의존성 설치 완료                                             |
| `npm test`            | 콘텐츠 무결성 검사 5개 통과                                  |
| `npm run typecheck`   | 통과                                                         |
| `npm run build`       | 통과, 46개 정적 페이지 생성                                  |
| 연구·지도 데이터 비교 | v1.0.0과 v1.1.0의 `research.json`, `map.json` SHA-256 동일   |
| 공개 API E2E          | desktop / tablet / mobile-375 / mobile 4개 프로젝트에서 통과 |

빌드 시 상위 사용자 디렉터리의 lockfile을 저장소 바깥 파일로 무시한다는 Next.js 안내가 있었으며 빌드 실패는 없었습니다. 사이트는 API 키 없이 로컬 프로덕션 서버로 실행되었습니다.

## 실행했지만 완료하지 못한 검사

`CHROME_PATH`에 설치된 Google Chrome 실행 파일을 지정하여 E2E 전체와 Lighthouse 성능 계측을 시도했습니다.

- E2E: 52개 테스트 중 공개 API 검사 4개 통과. 브라우저가 필요한 48개는 Chrome 시작 단계에서 `browserType.launch: Target page, context or browser has been closed`, 프로세스 `SIGABRT`로 중단되었습니다. 페이지 assertion 실패로 확인된 결과가 아닙니다.
- Lighthouse: Chrome 디버깅 포트를 기다리다 `waiting for dynamic debugging port in chrome-err.log` 오류로 중단되었습니다. 성능·LCP·CLS·접근성 점수를 얻지 못했습니다.
- Safari 대체 확인도 컴퓨터 사용 도구에서 승인되지 않아 수행하지 못했습니다.
- 따라서 이번 환경에서 스크린샷, 시각 확인, 브라우저 접근성 검사, E2E 핵심 흐름 통과, 모바일 오버플로 검사 완료를 주장하지 않습니다.

브라우저 실행이 가능한 환경에서 아래 명령을 실행해야 합니다. 테스트에는 375·390·768·1440px 프로젝트, EN/KO 375·390·768·1024·1440px 격자 분리 검사, 폴더 열기 취소·선택 복원·Home/End 경로가 포함됩니다.

```sh
npm ci
npx playwright install chromium
npm run build
npm run start
# 별도 터미널
npm run test:e2e
npm run audit:performance
```

기존 Chrome을 사용할 때는 `CHROME_PATH`로 실행 파일을 지정합니다. Lighthouse는 지정이 없으면 chrome-launcher의 설치 브라우저 탐색을 사용합니다. E2E는 Playwright 관리 Chromium을 사용합니다.

## 확인하지 않은 범위

Safari/iOS·Firefox 실기기, 스크린리더 실사용, 현장 Core Web Vitals, 전체 원문 검증, 검수 번역, Supabase/Oracle/Foundry 연결, 실제 웹사이트 배포. v1.1.0은 GitHub에 보관할 사이트 디자인 개선본이며 연구 검증을 완료한 버전이 아닙니다.
