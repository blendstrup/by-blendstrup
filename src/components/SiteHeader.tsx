import { useTranslations } from "next-intl";
import LanguageToggle from "./LanguageToggle";

export default function SiteHeader() {
  const t = useTranslations();

  return (
    <header className="sticky top-0 z-40 h-16 bg-oat border-b border-clay/30">
      <div className="max-w-screen-xl mx-auto h-full flex items-center justify-between px-12 lg:px-16">
        {/* Site name — brand, not translated */}
        <span className="font-serif text-[28px] font-normal tracking-tight text-ink">
          {t("site.name")}
        </span>
        <LanguageToggle />
      </div>
    </header>
  );
}
