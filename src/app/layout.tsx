import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { site } from "@/data/site-content";

export const metadata: Metadata = {
  metadataBase: new URL(site.canonicalUrl),
  title: { default: site.title, template: "%s | EDR Nord Toulousain" },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "fr_FR", siteName: site.name, title: site.title, description: site.description, url: "/" },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body><a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:p-3">Aller au contenu</a><Header /><main id="contenu">{children}</main><Footer /></body></html>;
}
