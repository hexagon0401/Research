import type { Metadata } from "next";
import Link from "next/link";
import { Localized as L, MotionControl } from "@/components/preferences";
export const metadata: Metadata = {
  title: "Accessibility & reading preferences",
};
export default function Accessibility() {
  return (
    <main id="main" className="editorial">
      <div className="page-intro">
        <span className="eyebrow">
          ACCESSIBILITY / THE SAME INQUIRY, YOUR WAY
        </span>
        <h1>
          <L
            en={
              <>
                Room to read.
                <br />
                Ways to explore.
              </>
            }
            ko={
              <>
                편안하게 읽고,
                <br />
                자유롭게 탐색하세요.
              </>
            }
          />
        </h1>
        <p>
          <L
            en="The essay and all thirteen Korean–English research editions are available as HTML. No animation or pointer gesture is required to read them."
            ko="에세이와 13개 연구의 한국어·영어 전문은 HTML로 제공됩니다. 애니메이션이나 포인터 제스처 없이도 읽을 수 있습니다."
          />
        </p>
      </div>
      <article className="prose page-content">
        <h2>
          <L en="Motion preferences" ko="모션 설정" />
        </h2>
        <p>
          <L
            en="System reduced motion is always respected. You can also enable reduced motion here; that preference is stored in this browser. When your system requires reduced motion, this control is marked as a system preference."
            ko="시스템의 모션 감소 요청을 항상 따릅니다. 이 화면에서도 모션 감소를 추가로 켤 수 있으며 선택은 이 브라우저에 저장됩니다. 시스템에서 모션 감소를 요청하면 컨트롤에 시스템 설정으로 표시합니다."
          />
        </p>
        <MotionControl />
        <h2>
          <L en="Keyboard & touch" ko="키보드와 터치" />
        </h2>
        <ul>
          <li>
            <L
              en="Follow the essay's outline and country links to move between arguments. Wheel and touch gestures keep their native browser behavior."
              ko="에세이의 흐름과 국가 링크로 논지를 이동합니다. 휠과 터치 제스처는 브라우저 기본 동작을 유지합니다."
            />
          </li>
          <li>
            <L
              en="Tab moves between links and controls. Enter follows a research link or activates a button."
              ko="Tab으로 링크와 컨트롤을 이동합니다. Enter로 연구 링크를 열거나 버튼을 실행합니다."
            />
          </li>
          <li>
            <L
              en="Use the reader's Korean and English buttons to change language while keeping your current paragraph. Wide screens also support paired reading."
              ko="리더의 한국어·English 버튼으로 현재 문단을 유지하며 언어를 바꿉니다. 넓은 화면에서는 나란히 읽기도 제공합니다."
            />
          </li>
          <li>
            <L
              en="On narrow screens, diagrams appear between paragraphs. Wide tables can scroll horizontally within their own region. PDF controls support page changes, zoom and download."
              ko="좁은 화면에서는 문단 사이에 관계도를 배치합니다. 넓은 표는 표 영역 안에서 가로로 스크롤할 수 있습니다. PDF는 쪽 이동·확대·축소·다운로드를 지원합니다."
            />
          </li>
          <li>
            <L
              en="Use the archive link or your browser's Back button to leave a reader. There are no focus-trapping overlays."
              ko="아카이브 링크나 브라우저 뒤로가기로 리더에서 나옵니다. 포커스를 가두는 오버레이는 없습니다."
            />
          </li>
        </ul>
        <h2>
          <L en="Plain reading & printing" ko="일반 읽기와 인쇄" />
        </h2>
        <p>
          <L
            en="The archive provides a searchable research list. Individual document URLs can be opened directly, reloaded and printed. Without JavaScript, both language editions and PDF download links remain available. Filtering, language controls and the inline PDF canvas require JavaScript."
            ko="아카이브에서 연구 목록을 검색할 수 있습니다. 각 문서는 직접 URL로 열고 새로고침하거나 인쇄할 수 있습니다. JavaScript를 끄더라도 양쪽 언어의 전문과 PDF 다운로드 링크는 유지됩니다. 필터·언어 조작·사이트 안의 PDF 캔버스에는 JavaScript가 필요합니다."
          />
        </p>
        <Link className="inline-link" href="/archive">
          <L en="Open the document index" ko="문서 목차 열기" /> ↗
        </Link>
      </article>
    </main>
  );
}
