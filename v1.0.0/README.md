# IIR — Interactive Research Atlas · v1.0.0

두 계획 문서를 바탕으로 만든 **동작하는 사이트 초안**입니다. Next.js App Router, React, TypeScript, SVG와 CSS로 구현했습니다. 완성된 연구 결과나 검수 번역을 가정하지 않습니다.

## 실행

Node.js 24, npm 11 기준으로 검증했습니다. 외부 서비스나 API 키는 필요하지 않습니다.

```bash
cd /workspace/Research/v1.0.0
npm ci --cache /workspace/.npm-cache
npm run dev
```

프로덕션 실행:

```bash
npm run build
npm run start
```

기본 포트는 3000입니다. 변경하려면 `npm run dev -- --port 3001`을 사용합니다. 이미 실행 중인 서비스를 확인한 뒤 새 프로세스를 시작하세요. 각 클라우드 작업은 격리되므로 기존 체크아웃을 사용하며, 별도 Git worktree는 필요하지 않습니다.

## 구현 범위

- 일곱 장면의 수직 내러티브와 장면 탐색, `?scene=world` 직접 접근.
- 미국·중국·한국 비교 범위 SVG 지도, 국가 선택과 설명. 지도는 검증된 사건·거래 관계를 표현하지 않습니다.
- 강조색 선과 점선으로 구분한 개념 모델, 선택 가능한 노드와 원문 연결.
- 가로 스와이프·마우스 드래그·방향키를 지원하는 CSS 폴더 서가. 각 폴더는 실제 URL을 갖습니다.
- 내러티브에서 A 키 또는 의도적인 수평 트랙패드 입력으로 서가 접근, Escape로 이전 읽기 위치 복귀.
- 연구·문서 리더, 한국어 발췌문, 고정 문단 앵커, 문단 요약, 출처·검증 상태 레일, 다음 문서 탐색.
- 참고문헌과 아카이브 검색·분류·정렬. 저자명 검색 지원.
- EN/KO 주요 인터페이스 전환, 시스템 및 사용자 모션 감소 설정, 인쇄 스타일, JavaScript 미사용 시 본문·링크 접근.
- 공개 콘텐츠 전용 읽기 API. 쓰기·인증·비공개 문서 경로는 제공하지 않습니다.

연구 본문의 검수 영어 번역은 없습니다. EN 문서 모드는 `Translation pending`을 표시하고 한국어 원문을 유지합니다. 영어 탐색 문구는 편집된 UI 문구이며 검수 번역이 아닙니다.

## 페이지와 데이터

| 경로                          | 내용                              |
| ----------------------------- | --------------------------------- |
| `/`                           | 메인 내러티브                     |
| `/archive`                    | 폴더 서가와 검색 가능한 문서 목록 |
| `/archive/[slug]`             | 출처가 연결된 작업계획 발췌문     |
| `/research/[slug]`            | 동일 연구의 독립 읽기 URL         |
| `/library`, `/library/[slug]` | 제공된 계획 문서와 참고문헌 후보  |
| `/methods`                    | 확보 자료, 검증 계획, 한계        |
| `/about`                      | 연구의 범위와 정직한 활동 귀속    |
| `/accessibility`              | 키보드·모션·일반 읽기 안내        |

공개 데이터는 `src/content/research.json`, 조회 어댑터는 `src/content/repository.ts`에 있습니다. Supabase로 옮길 때 UI에서 직접 DB를 호출하지 않고 이 어댑터를 교체합니다. 지도 경로는 `src/content/map.json`에 사전 생성되어 런타임 지도 라이브러리나 타일 서버를 사용하지 않습니다.

공개 API: `/api/public/manifest`, `/api/public/projects/[slug]`, `/api/public/documents/[slug]`, `/api/public/sources`, `/api/public/claims/[id]`. 데이터는 빌드 시 정적으로 렌더링되며 변경 후 다시 빌드해야 합니다. 엔드포인트는 전체 원문·인증정보를 반환하지 않습니다. 현재 자료가 작으므로 전체 공개 인덱스를 제공하며 대규모 수집·페이지네이션은 후속 범위입니다.

## 검증

```bash
npm test
npm run typecheck
npm run format:check
npm run build
# 별도 터미널에서 npm run start 실행 후
npm run test:e2e
npm run audit:performance
```

E2E와 성능 계측은 `/usr/bin/chromium`을 사용합니다. 성능 계측 브라우저 경로는 `CHROME_PATH`로 변경할 수 있습니다. Playwright 설정은 `playwright.config.ts`에서 조정합니다. 성능 상세 결과와 테스트 트레이스는 Git에서 제외됩니다.

- [검증 결과와 성능](docs/VALIDATION.md)
- [Open Design 이관](docs/DESIGN_HANDOFF.md)
- [콘텐츠 감사와 원문 해시](docs/CONTENT_AUDIT.md)
- [구현 범위 및 후속 작업](docs/IMPLEMENTATION_STATUS.md)

## 공개 전 남은 작업

실제 연구 원문 13종, 수치 원자료·코드, 검수 번역, 원본 공개 권한을 확보해야 합니다. 완성된 통합 연구 보고서·통계 재현·연구 사실검증은 이번 사이트 제작에서 수행한 것으로 표시하지 않습니다. 제공된 파일에 포함된 연구 수행 지시는 사이트 콘텐츠 설계의 참고자료로 사용했으며, 별도의 연구 보고서 작성 요청으로 취급하지 않았습니다.

현재 `robots.txt`와 메타데이터는 초안의 검색 노출을 막도록 설정했습니다. 공개 도메인이 결정되면 canonical·sitemap·언어별 URL 정책을 설정하고 noindex를 해제하세요. 배포나 외부 서비스 연결은 수행하지 않았습니다.

## 화면 미리보기

- [Desktop](docs/previews/desktop.png)
- [Mobile](docs/previews/mobile.png)
- [한국어 UI](docs/previews/korean.png)

현재 빌드·콘텐츠 검사 5개·브라우저 E2E 22개가 통과했습니다. 모바일 Lighthouse는 성능 86 / 접근성 100 / Best Practices 100으로 측정했으며, LCP 3.3초는 명세의 2.5초 목표에 미달합니다. 상세 조건과 한계는 검증 문서에 기록했습니다.
