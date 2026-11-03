import inventory from "@/config/emphasis.json";
import { emphasisParts } from "@/utils/emphasis";
/** Safe in server and client trees; the supplied text is returned character-for-character. */
export function EmphasisText({
  text,
  target,
  lang,
}: {
  text: string;
  target: string;
  lang: "ko" | "en";
}) {
  return emphasisParts(text, inventory, target, lang).map((part) =>
    part.entry ? (
      <span
        key={part.entry.id}
        data-emphasis={part.entry.id}
        data-em-static={part.entry.static || undefined}
        className={`em-${part.entry.device}`}
      >
        {part.text}
      </span>
    ) : (
      part.text
    ),
  );
}
