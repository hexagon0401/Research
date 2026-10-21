"use client";
import { useEffect, useState } from "react";
const scenes = [
  ["question", "The question"],
  ["world", "The world"],
  ["corporations", "The firm"],
  ["evidence", "The evidence"],
  ["framework", "The framework"],
  ["synthesis", "The synthesis"],
  ["index", "The archive"],
];
export function Progress() {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            const i = scenes.findIndex(([id]) => id === entry.target.id);
            if (i >= 0) setCurrent(i);
          }
      },
      { rootMargin: "-15% 0px -60% 0px", threshold: 0 },
    );
    scenes.forEach(([id]) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    const query = new URLSearchParams(location.search).get("scene");
    if (query && scenes.some(([id]) => id === query))
      document.getElementById(query)?.scrollIntoView({ behavior: "instant" });
    return () => observer.disconnect();
  }, []);
  return (
    <aside className="scene-progress" aria-label="Narrative chapters">
      <span className="mono">0{current + 1} / 07</span>
      <div>
        {scenes.map(([id, title], i) => (
          <a
            key={id}
            href={`#${id}`}
            className={i === current ? "active" : ""}
            aria-current={i === current ? "location" : undefined}
            aria-label={title}
          >
            <span />
          </a>
        ))}
      </div>
      <span className="progress-label">{scenes[current][1]}</span>
    </aside>
  );
}
