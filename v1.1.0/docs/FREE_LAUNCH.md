# 무료 배포와 원본 접수 — 2026-10-21

이 작업의 비용 한도는 **0원**입니다. Vercel Hobby 개인 계정과 Supabase Free만 사용하며 유료 전환·카드 등록·유료 도메인 구매·Oracle 인스턴스 생성을 수행하지 않습니다. 기존 v1.0.0은 보존하고 GitHub의 최신 v1.1.0 디자인에 원본 열람 준비를 추가했습니다.

## 지금 파일을 올릴 곳

**현재 Codex 채팅에 연구 보고서를 첨부하면 됩니다.** 우선 보고서 한 개의 PDF와 작성 원본(HWP/HWPX/DOCX)을 함께 제공하는 방식을 권장합니다. PDF만 있어도 시작할 수 있습니다. 가능한 한 파일당 20MiB 이하로 준비하면 현재 무료 저장소 연결 절차에 그대로 사용할 수 있습니다. 더 큰 파일은 원본을 임의로 줄이거나 바꾸지 않고 별도로 처리합니다.

업로드는 인터넷 공개와 다릅니다. 받은 파일은 비공개 접수 디렉터리에 보존하고 SHA-256·형식·텍스트 추출 상태·개인정보 검토·공개 가능 여부를 기록합니다. GitHub나 `public/`에 원본을 넣지 않습니다. 아직 받은 연구 원본은 없고, 기존 두 첨부는 계획 문서입니다.

로컬 접수 예:

```sh
cd /workspace/Research/v1.1.0
npm run intake -- /workspace/attachments/실제경로/보고서.pdf
```

결과는 `.local/intake/<sha256>/`에 저장됩니다. 이 위치는 Git에서 제외됩니다. 작성 원본을 수정하지 않습니다. HWP는 보존·해시 확인 후 `HWP_PARSER_REQUIRED`로 표시하며 읽었다고 주장하지 않습니다. PDF에 추출 가능한 글자가 없으면 OCR이 필요하다고 표시합니다. DOCX/HWPX는 XML의 문단 텍스트만 추출하며 표·이미지·수식의 완전한 해석을 주장하지 않습니다.

## Supabase: 사용자 화면에서 한 번 필요한 단계

프로젝트: `lchnlpnlfsgzisctefon`

공개 API URL: `https://lchnlpnlfsgzisctefon.supabase.co`

1. Supabase 프로젝트가 **Free** 조직/요금제인지 확인합니다. 유료 전환은 하지 않습니다.
2. 프로젝트의 **SQL Editor → New query**에서 [초기 설정 SQL](../supabase/migrations/202610210001_original_files.sql)의 전체 내용을 실행합니다.
3. 이 SQL은 비공개 버킷 `research-originals`, `research-reader`와 자산 메타데이터 테이블·권한을 준비합니다. 실제 보고서를 업로드하거나 공개하지 않습니다. 기존에 같은 이름의 버킷이 공개 상태이면 중단합니다.
4. **Settings → API Keys**의 서버용 Secret key(또는 legacy `service_role`)를 이 작업 환경 설정의 **Secrets → SUPABASE_SECRET_KEY**에 입력하고 저장합니다. 키 값은 채팅으로 보내지 않습니다.
5. 환경 설정의 일반 변수 **SUPABASE_URL**은 위 프로젝트 URL로 설정합니다. 프로젝트 URL은 공개 정보이며 비밀 키와 다릅니다.

이 클라우드 환경에는 키의 요구사항과 허용 목적지 호스트만 저장했습니다. 실제 키 값이 연결되기 전에는 제가 인증된 업로드·조회·서명을 실행할 수 없습니다. 저장은 환경 게시와 별개입니다. 재사용 환경으로 확정하려면 환경 설정을 검토·저장한 뒤 환경을 게시합니다. 유료 플랜 변경과 관계없습니다.

관리 API/SQL 실행 권한은 서버용 프로젝트 키만으로 제공되지 않을 수 있으므로 SQL은 본인 대시보드에서 실행합니다. 키 연결 후에는 실제 프로젝트의 버킷·메타데이터 조회와 승인된 원본 열람을 별도로 검증해야 합니다.

## Vercel: 사용자 화면에서 한 번 필요한 단계

1. <https://vercel.com/new>에서 **무료 Hobby 개인 계정**을 선택합니다.
2. GitHub 저장소 **hexagon0401/Research**를 Import합니다. 유료 팀·Pro·결제수단 추가 화면으로 진행하지 않습니다.
3. Root Directory는 **v1.1.0**입니다. v1.0.0이나 저장소 루트가 아닙니다.
4. Framework: Next.js. Node: 24.x. Install: `npm ci`. Build: `npm run build`. Output Directory는 기본값을 유지합니다. `vercel.json`에 프레임워크·설치·빌드 설정을 저장했습니다.
5. Vercel 프로젝트 **Settings → Environment Variables**에 `SUPABASE_URL`, `SUPABASE_SECRET_KEY`를 입력합니다. 서버 키에 `NEXT_PUBLIC_`을 붙이지 않습니다. 이 작업의 환경 설정과 Vercel의 운영 환경 설정은 별도이므로 운영 사이트에도 필요합니다.
6. Deploy합니다. 환경 변수를 배포 후 추가했다면 Redeploy합니다. 별도 도메인 구매 없이 제공된 `vercel.app` 주소를 사용합니다.
7. 생성된 서비스 주소만 채팅으로 알려주세요. 키·토큰은 공유하지 않습니다. 그 주소에서 직접 문서 열기·원본 링크·새로고침을 확인합니다.

현재 도구에는 Vercel 계정 화면을 직접 조작하는 연결이 없고, Vercel 인증도 제공되지 않았습니다. GitHub 연결/Import는 사용자 화면에서 한 번 필요합니다. 이후 이 저장소가 연결되어 있으면 커밋에 따른 재배포를 활용할 수 있습니다. 실제 배포 상태와 공개 주소를 확인하기 전에는 배포 완료로 표시하지 않습니다.

원본 키가 없어도 기존 내러티브 사이트는 빌드·실행됩니다. 원본 버튼은 연결 대기 또는 저장소 오류를 안내하고 본문 읽기를 유지합니다.

## 원본의 저장·공개 흐름

1. 채팅 파일 비공개 접수 → 원본 보존·해시·추출·자료 ID 확인.
2. 학번·타인 이름 등 실제 포함된 정보를 확인하고 공개용 사본이 필요한지 결정.
3. 보존 원본은 `research-originals`, 공개 가능 파일은 비공개 `research-reader`에 업로드.
4. `research_assets`에 실제 제목·자료 ID·버전·MIME·크기·해시·연결 프로젝트를 등록. 기본 상태는 `draft`입니다.
5. 권리/개인정보 검토가 끝난 항목만 `rights_approved=true`, `privacy_approved=true`, `publication_state=published`, `published_at`을 설정.
6. 방문자가 원본을 누르면 서버가 최신 공개 상태를 확인하고 **5분 유효 링크**를 발급. 파일은 Supabase가 직접 전달합니다.

서명 링크는 유효기간 동안 재공유할 수 있고 다운로드한 사본은 회수할 수 없습니다. 비공개로 보관해야 할 자료는 익명 열람 대상으로 게시하지 않습니다. 자료 공개 승인과 연구 주장의 검증 상태는 별개로 유지합니다.

프런트엔드는 파일 목록을 클릭 시에만 조회합니다. JavaScript를 끈 경우 `/originals/[project]`의 일반 HTML 파일 목록을 사용합니다. 공개 API에는 스토리지 경로·버킷 이름·승인 내부 필드를 반환하지 않습니다. 임의 버킷/객체 경로를 요청으로 받아 서명하지 않습니다.

관리자용 업로드 예(실제 파일·자료 ID를 확인한 후 실행):

```sh
node scripts/upload-original.mjs .local/intake/실제해시/original.pdf S06 rev-001 preservation
node scripts/upload-original.mjs .local/intake/실제해시/original.pdf S06 rev-001 reader_pdf
```

업로더는 덮어쓰기 없이 비공개 버킷에만 전송합니다. 자산 레코드를 자동 게시하지 않습니다. 파일 형식/크기/서명/출처 검토가 끝나기 전에 예시를 실제 보고서라고 실행하지 않습니다.

## 무료 한도와 확인한 정책

2026-10-21에 공식 페이지를 직접 조회했습니다.

- [Vercel Hobby](https://vercel.com/docs/plans/hobby): 개인·비상업 용도 무료 플랜. 대부분의 사용 한도 초과는 기능 제한과 회복 대기이며, 유료 전환을 계획하지 않습니다.
- [Vercel Node.js](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions): 24.x와 22.x 제공, 24.x가 기본값으로 표시됨.
- [Supabase 가격표](https://supabase.com/pricing): Free $0, 파일 저장소 1GB, egress 5GB 및 cached egress 5GB가 표시됨. 저활동 1주 뒤 휴면과 활성 프로젝트 2개 제한이 표시됨. 실제 계정 콘솔의 현행 한도를 우선 확인합니다.

유료 휴면 해제 플랜·유료 도메인·keep-alive 작업은 추가하지 않습니다. 무료 프로젝트가 휴면하거나 한도를 초과하면 서비스가 제한될 수 있어 **무과금과 무중단 가용성을 동시에 보장하지 않습니다**. 원본 서비스가 제한돼도 기존 HTML 연구 내용은 계속 제공할 수 있도록 분리했습니다.

## 검증과 현재 미완료

- 빌드/TypeScript, 콘텐츠/공개 자산 정책 단위 테스트 9개 통과.
- 원본 비공개 접수 Python 테스트 3개 통과.
- 네트워크 격리 로컬 PostgreSQL 17에서 마이그레이션 반복 실행, 익명/인증 사용자의 연구 파일·메타데이터 접근/업로드/수정/삭제 차단, 다른 버킷 영향 없음, 공개 승인·경로 조건, 서버 역할 조회, 기존 공개 버킷 거부를 확인.
- 실제 Supabase 프로젝트는 인증 없는 요청에 HTTP 401로 응답해 네트워크 도달만 확인. 이는 관리자 인증 성공을 뜻하지 않음.
- 실제 프로젝트에 SQL 적용, 인증된 저장소 업로드·서명, 실제 연구 원본 접수, Vercel 서비스 주소 검증은 아직 완료되지 않음.

브라우저 검사는 desktop·tablet·375px mobile·390px mobile에서 57개 통과, 3개 의도적 중복 검사 건너뜀으로 완료했습니다. 원본 목록 지연 요청, 저장소 미연결 시 본문 유지, 서명 경로 no-store, JavaScript 미사용 파일 목록도 검증했습니다. 서가의 접근성 이름 불일치와 기존 테스트의 다중 status 선택자를 수정했습니다. 로컬 테스트를 실제 Supabase 운영 권한 테스트로 대신 표시하지 않습니다.

추가 확인: 실제 공개 자산이 생겨도 검사가 깨지지 않도록 원본 목록의 빈 응답 검사는 브라우저 요청만 고정하고, 없는 파일 검사는 독립 ID로 실행합니다. 해당 원본 E2E 8개를 다시 실행해 모두 통과했습니다. 리더의 원본 패널 닫힘/열림 상태 axe 검사에서도 위반이 없었습니다.
