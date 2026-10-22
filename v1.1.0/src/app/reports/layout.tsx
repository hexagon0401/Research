import "@fontsource/ibm-plex-sans-kr/400.css";
import "@fontsource/ibm-plex-sans-kr/500.css";

// Full Korean transcripts are visible in server-rendered HTML. Load their font
// CSS with this route so hydration does not introduce a delayed font layout.
export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
