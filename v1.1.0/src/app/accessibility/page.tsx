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
            en="Every research excerpt is available as HTML. No WebGL, animation or pointer gesture is required to access the content."
            ko="모든 연구 발췌문은 HTML로 제공됩니다. WebGL, 애니메이션, 포인터 제스처 없이도 내용에 접근할 수 있습니다."
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
              en="On the narrative, press A while outside a control to reach the archive. Escape returns to the previous reading position after this shortcut. Wheel and touch gestures keep their native browser behavior."
              ko="내러티브에서 컨트롤 밖에 있을 때 A 키로 서가에 접근합니다. 이 단축 탐색 후 Escape로 이전 읽기 위치로 돌아갑니다. 휠과 터치 제스처는 브라우저 기본 동작을 유지합니다."
            />
          </li>
          <li>
            <L
              en="Tab moves between links and controls. Enter opens a folder."
              ko="Tab으로 링크와 컨트롤을 이동하고 Enter로 폴더를 엽니다."
            />
          </li>
          <li>
            <L
              en="Left and right arrow keys move between folders when focus is on the shelf."
              ko="서가에 포커스가 있을 때 좌우 방향키로 폴더를 이동합니다."
            />
          </li>
          <li>
            <L
              en="On touch screens, swipe the shelf horizontally. Vertical reading uses standard browser scrolling."
              ko="터치 화면에서는 서가를 가로로 밀어 탐색합니다. 본문은 브라우저의 일반 세로 스크롤을 사용합니다."
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
            en="A searchable list sits below the spatial shelf. Individual document URLs can be opened directly, reloaded and printed. With JavaScript disabled, the rendered text and document links remain available; interactive filtering and preferences require JavaScript."
            ko="공간형 서가 아래에 검색 가능한 목록을 제공합니다. 각 문서는 직접 URL로 열고 새로고침하거나 인쇄할 수 있습니다. JavaScript를 끄더라도 렌더링된 본문과 문서 링크는 유지됩니다. 필터와 설정 변경에는 JavaScript가 필요합니다."
          />
        </p>
        <Link className="inline-link" href="/archive">
          <L en="Open the document index" ko="문서 목차 열기" /> ↗
        </Link>
      </article>
    </main>
  );
}
