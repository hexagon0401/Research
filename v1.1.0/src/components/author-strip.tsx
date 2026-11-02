import { Localized as L } from "./preferences";
import { researchAuthor as author } from "@/config/research-author";
export function AuthorStrip() {
  return (
    <div className="hero-author">
      <strong>
        <L ko={author.name.ko} en={author.name.en} />
      </strong>
      <span lang="ko">{author.affiliation}</span>
      <span>
        <L ko={author.period.ko} en={author.period.en} />
      </span>
      <a href={author.contact} target="_blank" rel="noopener noreferrer">
        LinkedIn ↗
      </a>
    </div>
  );
}
export function StudyNumberNote() {
  return (
    <p className="study-number-note">
      <L
        ko="연구번호는 각 자료의 식별자이며, 목록의 순번을 뜻하지 않습니다."
        en="Study IDs identify archive records; they are not positions in this list."
      />
    </p>
  );
}
