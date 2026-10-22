"use client";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
const KoreanFonts = dynamic(() => import("./korean-fonts"), { ssr: false });
import { createContext, useContext, useEffect, useState } from "react";
type Preferences = {
  lang: "en" | "ko";
  setLang: (lang: "en" | "ko") => void;
  reduced: boolean;
  systemReduced: boolean;
  setReduced: (value: boolean) => void;
};
const Context = createContext<Preferences>({
  lang: "en",
  setLang: () => {},
  reduced: false,
  systemReduced: false,
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
  const [systemReduced, setSystemReduced] = useState(false);
  useEffect(() => {
    try {
      const saved = localStorage.getItem("iir-language");
      if (saved === "en" || saved === "ko") {
        document.documentElement.lang = saved;
        setLang(saved);
      }
    } catch {}
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setSystemReduced(media.matches);
      try {
        const setting = localStorage.getItem("iir-reduced-motion");
        setReduced(media.matches || setting === "true");
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
    document.dispatchEvent(new Event("iir:before-language"));
    document.documentElement.lang = value;
    setLang(value);
    try {
      localStorage.setItem("iir-language", value);
    } catch {}
  };
  const updateMotion = (value: boolean) => {
    setReduced(value || matchMedia("(prefers-reduced-motion: reduce)").matches);
    try {
      localStorage.setItem("iir-reduced-motion", String(value));
    } catch {}
  };
  return (
    <Context.Provider
      value={{
        lang,
        setLang: updateLang,
        reduced,
        systemReduced,
        setReduced: updateMotion,
      }}
    >
      {(lang === "ko" ||
        pathname.startsWith("/research/") ||
        pathname.startsWith("/archive/") ||
        pathname.startsWith("/reports") ||
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
  const { reduced, systemReduced, setReduced, lang } = usePreferences();
  return (
    <button
      className="text-button"
      aria-pressed={reduced}
      disabled={systemReduced}
      onClick={() => setReduced(!reduced)}
    >
      {lang === "ko" ? "모션 줄이기" : "Reduce motion"}
      {systemReduced
        ? lang === "ko"
          ? " · 시스템 설정"
          : " · System preference"
        : ""}{" "}
      <span className="toggle" data-on={reduced}>
        {reduced ? "ON" : "OFF"}
      </span>
    </button>
  );
}
