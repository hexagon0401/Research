# Research

**최신 v2.4.0 → 코드 위치 [v1.1.0/](v1.1.0/)**

IIR 연구 사이트입니다. `v1.1.0/`은 Vercel의 고정 배포 경로이며, 현재 코드 버전은 **v2.4.0**입니다. 새 버전마다 폴더를 복제하지 않고 package 버전과 Git 태그로 구분합니다.

[사이트](https://research-hxgn.vercel.app) · [연구 자료실](https://research-hxgn.vercel.app/archive) · [v2.4.0 구현·검증](v1.1.0/docs/V2_4_RELEASE.md)

## 버전과 코드 위치

| 버전별 소스                                                          | 변경·검증 기록                                                |
| -------------------------------------------------------------------- | ------------------------------------------------------------- |
| [v2.4.0 · 최신](https://github.com/hexagon0401/Research/tree/v2.4.0) | [GSAP 연구 메커니즘·시간순 탐색](v1.1.0/docs/V2_4_RELEASE.md) |
| [v2.3.0](https://github.com/hexagon0401/Research/tree/v2.3.0)        | [읽기 흐름·그래픽 개선](v1.1.0/docs/V2_3_RELEASE.md)          |
| [v2.2.0](https://github.com/hexagon0401/Research/tree/v2.2.0)        | [Open Design 개편](v1.1.0/docs/V2_2_RELEASE.md)               |
| [v2.1.0](https://github.com/hexagon0401/Research/tree/v2.1.0)        | [연결형 에세이·한영 전문](v1.1.0/docs/V2_1_RELEASE.md)        |
| [v2.0.0](https://github.com/hexagon0401/Research/tree/v2.0.0)        | [연속형 스크롤](v1.1.0/docs/V2_RELEASE.md)                    |
| [v1.1.2](https://github.com/hexagon0401/Research/tree/v1.1.2)        | [원문·PDF 자료실](CHANGELOG.md#112--2026-10-22)               |
| [v1.1.1](https://github.com/hexagon0401/Research/tree/v1.1.1)        | [화살표 표시 오류 수정](CHANGELOG.md#111--2026-10-21)         |

위 버전의 앱 소스는 각 태그 안의 `v1.1.0/`에 있습니다. [v1.0.0/](v1.0.0/)은 이전 초안 보관용입니다. 전체 변경 내용은 [변경 기록](CHANGELOG.md)을 참고하세요.

## 사이트 구성

- GSAP·ScrollTrigger로 여섯 연구 구간의 선·신호·카메라·구조를 스크롤에 연결합니다. 중국의 시간순 사건 탐색, 모바일 다시 보기, 근거 렌즈와 연구망 관점을 제공합니다.

- Paper 바탕에서 18개 논지와 사례별 관계도·지도가 이어지고, 기업 역량·그린란드·통합 연구는 세 강조 구간으로 펼쳐집니다.
- 실제 연구와 참고자료를 폴더·책등으로 탐색하고, 축소 목차와 진행 표시로 읽기를 이어갑니다.
- 실제 연구 13개, 한국어·영어 전문 973개 문단, 관련 논지 강조와 왕복 링크.
- 사이트 안의 PDF 열람·다운로드. 영어는 편집 번역이며 저자 최종 검수 전입니다.
- Vercel Hobby·Supabase Free 유지. 비공개 보존 원본과 공개용 사본을 구분합니다.

```sh
cd v1.1.0
npm ci
npm run dev
```

http://localhost:3000 에서 엽니다. [실행 안내](v1.1.0/README.md) · [디자인 이관](v1.1.0/docs/DESIGN_HANDOFF.md) · [무료 운영 안내](v1.1.0/docs/FREE_LAUNCH.md)

이전 [v1.0.0 초안](v1.0.0/)과 기존 Git 태그는 보존됩니다. 연구의 사실·통계 검증 상태는 각 본문과 릴리스 기록을 따릅니다. 추가 원본은 채팅에 첨부하면 비공개 접수부터 진행할 수 있습니다.
