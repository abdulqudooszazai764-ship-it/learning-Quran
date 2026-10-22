"use client";

import { useState, useRef, useEffect } from "react";
import { Globe, Check } from "lucide-react";
import { LANGUAGES, useLanguage, type LangCode } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const { lang, setLang, tr } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="lang-switcher" ref={ref}>
      <button
        type="button"
        className="lang-btn"
        onClick={() => setOpen((v) => !v)}
        aria-label={tr("language")}
        aria-expanded={open}
      >
        <Globe size={16} />
        <span className="lang-current">
          {LANGUAGES.find((l) => l.code === lang)?.native}
        </span>
      </button>
      {open && (
        <div className="lang-dropdown glass-strong" role="listbox">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              role="option"
              aria-selected={lang === l.code}
              className={cn("lang-option", lang === l.code && "active")}
              onClick={() => {
                setLang(l.code as LangCode);
                setOpen(false);
              }}
            >
              <span className="lang-native">{l.native}</span>
              <span className="lang-label">{l.label}</span>
              {lang === l.code && <Check size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
