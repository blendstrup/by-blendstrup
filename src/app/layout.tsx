import "./globals.css";

// Root layout is a passthrough — the [locale] layout owns <html> and <body>
// so that it can set lang={locale} and inject font variables.
// Next.js requires this file to exist but it does not need to render html/body
// when a nested layout handles that.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
