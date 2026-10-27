import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
export type Locale = "zh" | "en";
interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (zh: string, en: string) => string;
}
const LanguageContext = createContext<LanguageContextValue>({
  locale: "zh",
  setLocale: () => {},
  t: (zh) => zh,
});
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    try {
      return localStorage.getItem("multiscale-language") === "en" ? "en" : "zh";
    } catch {
      return "zh";
    }
  });
  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        locale === "zh"
          ? "从电子到工程结构，沿长度与时间探索多尺度建模。8个基础章节、11种方法、递进推导与交互实验。"
          : "Explore multiscale modeling across length and time: eight foundation chapters, eleven methods, illustrated derivations and interactive experiments.",
      );
    try {
      localStorage.setItem("multiscale-language", locale);
    } catch {}
  }, [locale]);
  return (
    <LanguageContext.Provider
      value={{ locale, setLocale, t: (zh, en) => (locale === "zh" ? zh : en) }}
    >
      {children}
    </LanguageContext.Provider>
  );
}
export function useLanguage() {
  return useContext(LanguageContext);
}
