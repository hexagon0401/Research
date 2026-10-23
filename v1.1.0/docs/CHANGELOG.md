# Changelog

현재 릴리스는 **v2.3.0**이며, 앱의 배포 경로는 `v1.1.0/`입니다. [버전별 소스와 검증 기록](../../README.md#버전과-코드-위치)을 함께 참고하세요.

## 2.3.0 — 2026-10-23

지도 지형·지명·마커를 분리하고 Pretext 1.0.0 측정과 화면 픽셀 라벨 배치를 적용했습니다. 각 사례가 그림·제목·범례·출처를 함께 소유하며, 기업 역량·그린란드·최종 통합은 정상 문서 흐름의 전체 폭 장면입니다. 원문 강조·전문용어·기여 역할 링크·문단 복귀·비교 읽기를 추가했습니다. [구현과 실제 검증 기록](V2_3_RELEASE.md).

## 2.2.0 — 2026-10-22

메인의 검정 패널·포인터 추적·배경색 보간을 제거하고 여섯 연구 흐름과 스크롤 기반 지리·개념 설명으로 재구성했습니다. Archive의 실제 연구 13개와 Library의 참고자료 4개를 폴더·책장으로 탐색합니다. 기존 연구·번역·PDF·백엔드는 보존합니다. 상세 변경과 실제 검사 범위는 [v2.2.0 기록](V2_2_RELEASE.md)을 따릅니다.

아래는 이전 버전 작성 당시의 기록입니다. v2.1.0 당시 상태는 [구현·검증 기록](V2_1_RELEASE.md)과 [원문 자료실](REPORT_ARCHIVE.md)을 참고하세요.

## 2.1.0 — 2026-10-22

- Replaced the seven-part homepage presentation with a bilingual S00-led long-form essay, 18 connected arguments, concrete US/China/Korea cases and specific links to supporting source passages.
- Added one continuous concept/world/Arctic/integration visual stage, mobile inline diagrams, native scrolling, bounded pointer response and reduced-motion alternatives.
- Completed 13 Korean reading editions and 973 corresponding editorial English passages. Restored PDF punctuation, reading order and selected tables while preserving raw transcripts and existing PDF/original hashes. English remains pending author review.
- Added paired HTML reading, contextual sentence highlights, legacy anchors, main-return links and a lazy self-hosted PDF viewer with page, zoom, fullscreen and download controls.
- Changed the archive default to all 13 actual reports, retained legacy topics and extended the public report API additively.
- Fixed double scroll compensation during reading-language changes and stopped whole-report prefetching from the homepage.
- Validation and remaining source/platform limitations: V2_1_RELEASE.md.

## 1.1.0 — 2026-10-21

- 기존 v1.0.0을 보존한 별도 버전 디렉터리.
- 대형 편집형 Hero, 독립 영역의 개념 구체, 읽기 쉬운 질문·상태 안내.
- 국가 선택·설명의 아틀라스 배치와 흐름형 개념도.
- CSS 종이층·사선 폴더, 취소 가능한 표지 열기, 선택 복원, Home/End 탐색.
- 문서·출처 레일·검색·필터의 크기와 간격 개선.
- 375/390/768/1024/1440px 반응형 구성, 포커스·터치·모션 감소·인쇄 경로 유지.
- 환경변수 CHROME_PATH 또는 Playwright 관리 브라우저를 지원하도록 E2E 실행 설정 개선.

연구 콘텐츠와 근거·번역 상태는 변경하지 않았습니다. 실제 실행 결과는 VALIDATION.md를 따릅니다.

## 1.0.0

초기 연구 아틀라스 프로토타입. 보관된 소스와 당시 검증 기록은 ../v1.0.0/에 있습니다.
