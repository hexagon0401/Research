import raw from "./research.json";
export const projects = raw.projects;
export const sources = raw.sources;
export const evidenceNeeds = raw.evidenceNeeds;
export const revision = raw.revision;
export type Project = (typeof projects)[number];
export type Source = (typeof sources)[number];
export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
export function getSource(slug: string) {
  return sources.find((s) => s.slug === slug);
}
