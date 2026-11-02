import { researchAuthor } from "@/config/research-author";
import { Localized as L } from "./preferences";
import { reports } from "@/content/report-catalog";
/** A printed study identifier; geography remains decorative, not a plotted claim. */
export function HeroAtlas() {
  return (
    <figure className="hero-atlas folio-atlas" aria-hidden="true">
      <div className="atlas-folio-label">
        <span>IIR / S00</span>
        <span>{researchAuthor.period.years}</span>
      </div>
      <svg
        viewBox="0 0 720 520"
        width="720"
        height="520"
        preserveAspectRatio="xMidYMid meet"
      >
        <use href="/visuals/globe.svg#terrain" />
      </svg>
      <span className="atlas-folio-number">S00</span>
      <figcaption className="atlas-folio-caption">
        <span>
          <L ko="통합 연구" en="The integrated study" />
        </span>
        <span>
          <L
            ko={`${reports.length}개 연구, 하나의 질문`}
            en={`${reports.length} studies, one inquiry`}
          />
        </span>
      </figcaption>
    </figure>
  );
}
