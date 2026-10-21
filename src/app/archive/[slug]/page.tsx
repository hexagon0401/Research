import { notFound } from "next/navigation";
import { getProject, projects } from "@/content/repository";
import { Reader } from "@/components/reader";
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const p = getProject((await params).slug);
  return {
    title: p?.title ?? "Document not found",
    description: p?.description,
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const p = getProject((await params).slug);
  if (!p) notFound();
  return (
    <main id="main">
      <Reader project={p} />
    </main>
  );
}
