import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./story.css";
import { PreferencesProvider } from "@/components/preferences";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
const geist = localFont({
  src: "../../node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2",
  variable: "--font-geist",
  display: "optional",
  weight: "100 900",
  preload: true,
});
const plex = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-plex",
  display: "optional",
  preload: false,
});
export const metadata: Metadata = {
  title: { default: "IIR — The Architecture of Power", template: "%s — IIR" },
  description:
    "An integrated inquiry into technology, corporate identity and national power. Read the S00 essay and thirteen Korean–English research reports with source PDFs.",
  robots: { index: false, follow: true },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} ${plex.variable}`}>
      <body id="top">
        <PreferencesProvider>
          <a className="skip-link" href="#main">
            Skip to research
          </a>
          <Header />
          {children}
          <Footer />
        </PreferencesProvider>
      </body>
    </html>
  );
}
