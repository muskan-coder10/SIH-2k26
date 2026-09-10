import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { translations } from "./translations.js";

const LanguageContext = createContext(null);

function getByPath(obj, path) {
  return path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("sk-lang") || "en");

  const changeLang = (next) => {
    setLang(next);
    try {
      localStorage.setItem("sk-lang", next);
    } catch {
      // ignore storage errors (private browsing etc.)
    }
  };

  const t = useMemo(() => {
    return (path) => {
      const value = getByPath(translations[lang], path);
      if (value === undefined) {
        // Fall back to English, then to the raw key, so the UI never breaks.
        const fallback = getByPath(translations.en, path);
        return fallback !== undefined ? fallback : path;
      }
      return value;
    };
  }, [lang]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = { lang, setLang: changeLang, t };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
