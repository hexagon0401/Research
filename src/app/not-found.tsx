import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="editorial page-intro">
      <span className="eyebrow">404 / NOT IN THE INDEX</span>
      <h1>
        This page is
        <br />
        still unwritten.
      </h1>
      <p>
        The document could not be found. Return to the archive to explore the
        available planning excerpts.
      </p>
      <Link className="button" href="/archive">
        Open archive ↗
      </Link>
    </main>
  );
}
