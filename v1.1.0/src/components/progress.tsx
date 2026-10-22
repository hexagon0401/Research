"use client";
import { chapters, useNarrative } from "./scroll-narrative";
import { usePreferences } from "./preferences";
const names = [
  "The question",
  "The world",
  "The firm",
  "The evidence",
  "The framework",
  "The synthesis",
  "The archive",
];
const namesKo = [
  "질문",
  "세계",
  "기업",
  "근거",
  "프레임워크",
  "종합",
  "자료실",
];
export function Progress() {
  const { current } = useNarrative();
  const { lang } = usePreferences();
  const labels = lang === "ko" ? namesKo : names;
  return (
    <aside
      className="scene-progress"
      aria-label={lang === "ko" ? "탐구의 흐름" : "Narrative chapters"}
    >
      <span className="mono">0{current + 1} / 07</span>
      <div>
        {chapters.map((id, i) => (
          <a
            key={id}
            href={`#${id}`}
            className={i === current ? "active" : ""}
            aria-current={i === current ? "location" : undefined}
            aria-label={labels[i]}
          >
            <span />
          </a>
        ))}
      </div>
      <span className="progress-label">{labels[current]}</span>
    </aside>
  );
}
