import { useTranslation } from "react-i18next";

const LANGS = [
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
  { code: "pt", label: "PT" },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="flex items-center gap-1 bg-elevated border border-border rounded-lg p-1">
      {LANGS.map((l) => (
        <button
          key={l.code}
          onClick={() => i18n.changeLanguage(l.code)}
          className={`flex-1 text-[11px] font-mono py-1 rounded-md transition-colors ${
            i18n.language?.startsWith(l.code)
              ? "bg-primary text-white"
              : "text-ink-faint hover:text-ink"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
