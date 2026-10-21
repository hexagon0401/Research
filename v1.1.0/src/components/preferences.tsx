"use client";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
const KoreanFonts = dynamic(() => import("./korean-fonts"), { ssr: false });
import { createContext, useContext, useEffect, useState } from "react";
type Preferences = {
  lang: "en" | "ko";
  setLang: (lang: "en" | "ko") => void;
  reduced: boolean;
  setReduced: (value: boolean) => void;
};
const Context = createContext<Preferences>({
  lang: "en",
  setLang: () => {},
  reduced: false,
  setReduced: () => {},
});
export function PreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [lang, setLang] = useState<"en" | "ko">("en");
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    try {
      const saved = localStorage.getItem("iir-language");
      if (saved === "en" || saved === "ko") setLang(saved);
    } catch {}
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      try {
        const setting = localStorage.getItem("iir-reduced-motion");
        setReduced(setting === null ? media.matches : setting === "true");
      } catch {
        setReduced(media.matches);
      }
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dataset.motion = reduced ? "reduced" : "full";
  }, [lang, reduced]);
  const updateLang = (value: "en" | "ko") => {
    setLang(value);
    try {
      localStorage.setItem("iir-language", value);
    } catch {}
  };
  const updateMotion = (value: boolean) => {
    setReduced(value);
    try {
      localStorage.setItem("iir-reduced-motion", String(value));
    } catch {}
  };
  return (
    <Context.Provider
      value={{ lang, setLang: updateLang, reduced, setReduced: updateMotion }}
    >
      {(lang === "ko" ||
        pathname.startsWith("/research/") ||
        pathname.startsWith("/archive/") ||
        pathname === "/methods") && <KoreanFonts />}
      {children}
    </Context.Provider>
  );
}
export const usePreferences = () => useContext(Context);
export function Localized({
  en,
  ko,
}: {
  en: React.ReactNode;
  ko: React.ReactNode;
}) {
  const { lang } = usePreferences();
  return <>{lang === "ko" ? ko : en}</>;
}
export function MotionControl() {
  const { reduced, setReduced, lang } = usePreferences();
  return (
    <button
      className="text-button"
      aria-pressed={reduced}
      onClick={() => setReduced(!reduced)}
    >
      {lang === "ko" ? "모션 줄이기" : "Reduce motion"}{" "}
      <span className="toggle" data-on={reduced}>
        {reduced ? "ON" : "OFF"}
      </span>
    </button>
  );
}
