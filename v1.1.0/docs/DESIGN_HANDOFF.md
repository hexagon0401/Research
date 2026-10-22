# Open Design 이관 계약

## 현재 디자인 — v2.2.0

현재 메인은 `src/app/story.css`, `src/components/essay-experience.tsx`, `src/visuals/`를 사용합니다. 검정 사이드 패널과 포인터 추적 이동·배경색 보간은 제거했습니다. 논지의 진행에 따라 지리적 초점과 설명 도식만 움직이며, 지역 강조용 작은 그라데이션 외에는 반복 배경 효과를 쓰지 않습니다. 실제 자료 서가는 `material-shelf.tsx`입니다. 이 절과 [v2.2.0 시각 설계](V2_2_DESIGN.md)가 아래 이전 버전의 시각 구현 설명보다 우선합니다. 원문·출처·백엔드 불변조건은 계속 적용합니다.

이 저장소는 기능을 확인할 수 있는 초안입니다. Open Design 도구에 업로드하거나 외부로 전송한 상태가 아닙니다.

## 바꿀 수 있는 시각 계층

`src/app/tokens.css`를 디자인의 시작점으로 사용합니다.

| 토큰             | 값 / 역할                                          |
| ---------------- | -------------------------------------------------- |
| `--paper`        | `#E6E8E6`, 기본 배경                               |
| `--ink`          | `#0E131F`, 본문·뼈대                               |
| `--signal`       | `#0EFB2E`, 활성 경로·선·선택                       |
| `--font-display` | 로컬 Geist Variable                                |
| `--font-body`    | 로컬 IBM Plex Sans / IBM Plex Sans KR, 시스템 폴백 |
| `--gutter`       | `clamp(24px, 5vw, 84px)`                           |
| `--duration`     | 기본 260ms                                         |

전체 스타일은 `src/app/globals.css`에 있습니다. Tailwind나 UI 프레임워크를 혼용하지 않습니다. 지도와 개념도는 SVG 선 중심이며, 폴더는 CSS로 만든 2.5D 표현입니다. 무거운 WebGL과 애니메이션 엔진을 초기 의존성에 포함하지 않았습니다.

한국어는 로컬 IBM Plex Sans KR 400/500을 사용합니다. npm 패키지의 SIL Open Font License를 확인했으며, 한국어 UI나 원문이 필요한 경로에서만 폰트 CSS를 지연 로딩하고, Unicode 범위별 서브셋은 필요한 글리프만 브라우저가 요청합니다. JavaScript 미사용 시 시스템 CJK 폴백을 사용합니다. 외부 폰트 API를 호출하지 않습니다.

## 컴포넌트 지도

| 컴포넌트              | 역할 / 지켜야 할 계약                                 |
| --------------------- | ----------------------------------------------------- |
| `Header`, `Footer`    | 공통 내비게이션, UI 언어, 모션 설정                   |
| `Progress`            | IntersectionObserver 기반 장면 탐색, 본문 순서는 유지 |
| `Orbit`               | 장식용 개념 그래픽, `aria-hidden` 유지                |
| `Atlas`               | 선택 국가와 설명 연동, 지리 데이터 출처 유지          |
| `Framework`           | 가설·규범적 경계 도식, 점선 의미와 상태 유지          |
| `Shelf`               | 포커스·호버·스와이프·방향키, 실제 문서 링크 유지      |
| `Reader`              | 문단 ID, 검증 상태, 출처 레일, 번역 상태 유지         |
| `Collection`          | 실제 메타데이터 검색·필터·정렬·빈 결과                |
| `PreferencesProvider` | EN/KO UI·모션 설정; 번역 검수와 별개                  |

## 디자인 변경 시 불변조건

- 제공된 세 브랜드 색상을 유지하고 밝은 바탕에 네온 그린 본문을 쓰지 않습니다.
- 선·핀·화살표를 추가할 때 의미와 출처를 유지합니다. 비교 범위를 거래·지휘·인과 관계처럼 만들지 않습니다.
- 실제 연구 본문은 DOM 텍스트로 남깁니다. 캔버스 텍스처로 대체하지 않습니다.
- `P-001`~`P-006`, `CLAIM-01`~`CLAIM-06`, URL, 출처 위치를 바꾸지 않습니다.
- 미제공 데이터로 장식용 통계 차트를 만들지 않습니다.
- 문서 언어 EN은 검수 번역이 없으면 한국어와 번역 대기 표시를 유지합니다.
- 링크 hover는 글꼴 두께·크기·줄높이를 바꾸지 않습니다. 키보드 포커스 표시는 유지합니다.
- 모션 감소·터치·키보드·인쇄·No-JS 접근 경로를 유지합니다.
- 개인정보나 원문 파일의 공개 범위를 시각 작업 중 확대하지 않습니다.

## 권장 이관 순서

1. 토큰, 타이포그래피, 헤더와 Hero를 먼저 조정합니다.
2. 선형 지도·개념도의 선 굵기와 설명 가독성을 다듬습니다.
3. 폴더의 사선 시점·선택 상태와 리더 전환을 다듬습니다. v1.1.0은 CSS 표지 힌지·종이층·선택 복원을 제공하며, 복잡한 3D 힌지/공유 카메라 전환은 포함하지 않습니다.
4. 375·390·768·1440px에서 제목 줄바꿈과 터치 영역을 확인합니다.
5. `npm run test:e2e`와 성능 계측을 다시 실행합니다.

풀 3D가 필요해지는 경우에만 별도 지연 로딩 계층으로 추가하고 현재 SVG·HTML 경로를 폴백으로 보존합니다. 도입 전에 기기별 성능 예산과 디자인 편익을 확인하세요.

## v2.0.0 runtime contract — 2026-10-22

The homepage is a continuous native-scroll document. Keep one on-demand ScrollNarrative engine, explicit SVG bounds, stable chapter IDs and the source/claim distinction. Pointer decoration is bounded to 6px and never moves reading text or hit areas.

Map/framework preview is temporary; pinned user selection takes precedence over automatic reading flow. Preserve keyboard and touch alternatives. Do not restore global wheel interception, hide content before JavaScript initializes, or override system reduced motion.

The thirteen supplied sources are served separately at /reports with stable locators and reviewed reading copies. Original binaries remain private. Do not redraw reported plots as independently validated results or alter their values for visual effect. Visual token changes must retain contrast, reading order, source IDs and content privacy.

Measured results and untested platforms are recorded in [V2_RELEASE.md](V2_RELEASE.md).

## v2.1.0 active runtime contract — 2026-10-22

This section supersedes the older homepage component map above. The active main
route uses `EssayExperience`, `EssayVisual` and `SceneDiagram`, with 18 semantic
beats in `essay.ts`. The previous `ScrollNarrative`, `Atlas`, `Framework` and
`Shelf` remain historical components and are not the new homepage's engine.

- Preserve one native reading flow: no full-height slide spacers, snap stops or
  global smooth-scroll animation. The on-demand scroll callback changes CSS
  progress/tints and updates React only when the active argument changes.
- One persistent desktop stage crossfades concept, world, Arctic and integrated
  research layers. Mobile diagrams sit within the text. Pointer decoration moves
  geometry by at most 5px, not text or hit areas. System reduced motion wins.
- `essay-map-points.json` and generated SVGs share their geographic projection.
  The polar sea route is illustrative. Greenland proposals, Southeast Asian
  relationships and country comparison pins must not become observed shipments
  or completed investments through visual styling.
- `research-connections.ts` owns connection text and main-return anchors.
  `readings/` and `translations/` own paired text and fingerprints, independently
  of visual tokens. Preserve paragraph IDs, raw source references and aliases.
- `ParallelReading` provides paired columns and a compact KO/EN switch. Font CSS
  for reports arrives with server-rendered HTML. Changing reading language owns
  scroll compensation explicitly; native anchoring must not compensate again.
- `PdfReader` loads `pdf-canvas` and self-hosted PDF.js only after expansion.
  Keep the static download fallback and bounded single-page canvas lifecycle.
  Do not prefetch entire reports or PDF assets from the main essay.
- Both HTML editions remain readable without JavaScript. English is an editorial
  translation pending author review; translation presence is not verification.

Read [V2_1_RELEASE.md](V2_1_RELEASE.md) for measured checks and unresolved source
verification. Original binaries and existing reviewed PDF hashes stay unchanged.
