"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

export default function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("languageToggle");

  function switchLocale(nextLocale: "da" | "en") {
    if (nextLocale === locale) return;
    router.push(pathname, { locale: nextLocale });
  }

  return (
    <div className="flex items-center gap-2 h-11" aria-label="Language selector">
      {/* DA button */}
      <button
        onClick={() => switchLocale("da")}
        aria-current={locale === "da" ? "true" : undefined}
        className={[
          "text-sm min-h-[44px] px-1 transition-none",
          locale === "da"
            ? "text-terracotta font-medium"
            : "text-stone font-normal hover:underline",
        ].join(" ")}
      >
        {t("da")}
      </button>

      {/* Hairline divider */}
      <span className="text-clay text-sm select-none" aria-hidden="true">|</span>

      {/* EN button */}
      <button
        onClick={() => switchLocale("en")}
        aria-current={locale === "en" ? "true" : undefined}
        className={[
          "text-sm min-h-[44px] px-1 transition-none",
          locale === "en"
            ? "text-terracotta font-medium"
            : "text-stone font-normal hover:underline",
        ].join(" ")}
      >
        {t("en")}
      </button>
    </div>
  );
}
