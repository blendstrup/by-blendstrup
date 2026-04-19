import { useTranslations } from "next-intl";

export default function LocalePlaceholderPage() {
  const t = useTranslations("placeholder");

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px-theme(spacing.48))] px-6 py-24">
      <h1 className="font-serif text-5xl font-normal tracking-tight text-ink text-center">
        {t("heading")}
      </h1>
      <p className="mt-6 text-base font-normal text-stone text-center">
        {t("body")}
      </p>
    </div>
  );
}
