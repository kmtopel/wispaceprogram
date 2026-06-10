// Root layout: shared header/footer, fonts, and site-wide metadata.
import { Fraunces, Inter_Tight } from "next/font/google";
import { client, sanityFetchOptions } from "@/sanity/client";
import { siteSettingsQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/image";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import "./globals.css";

// Display serif for headings. Variable axes ("SOFT", "WONK") let us pull in a
// slightly soft, hand-drawn feel that complements the curly wordmark logo.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

// Modern sans for body — Inter Tight is more chic than vanilla Inter while
// still being highly readable.
const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "WI Space Program",
  description: "Official site of WI Space Program.",
};

// Bundled SVG fallbacks if no logo has been uploaded to Site Settings.
const DEFAULT_SPLASH_LOGO = "/logos/horizontal-wordmark.svg";
const DEFAULT_DESKTOP_LOGO = "/logos/horizontal-wordmark.svg";
const DEFAULT_MOBILE_LOGO = "/logos/horizontal-monogram.svg";

export default async function RootLayout({ children }) {
  const settings = await client.fetch(
    siteSettingsQuery,
    {},
    sanityFetchOptions,
  );

  const splashLogoUrl = settings?.splashLogo
    ? urlFor(settings.splashLogo).url()
    : DEFAULT_SPLASH_LOGO;
  const desktopLogoUrl = settings?.desktopLogo
    ? urlFor(settings.desktopLogo).url()
    : DEFAULT_DESKTOP_LOGO;
  const mobileLogoUrl = settings?.mobileLogo
    ? urlFor(settings.mobileLogo).url()
    : DEFAULT_MOBILE_LOGO;

  return (
    <html lang="en">
      <head>
        {/* Preconnect to external origins we know we'll load from. Saves
            DNS/TLS roundtrip when those resources are eventually requested. */}
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="" />
        <link rel="preconnect" href="https://i.ytimg.com" crossOrigin="" />
        <link
          rel="preconnect"
          href="https://www.youtube-nocookie.com"
          crossOrigin=""
        />
        <link rel="preconnect" href="https://bandcamp.com" crossOrigin="" />
      </head>
      <body
        className={`${fraunces.variable} ${interTight.variable} antialiased`}
      >
        <SiteHeader
          splashLogoUrl={splashLogoUrl}
          desktopLogoUrl={desktopLogoUrl}
          mobileLogoUrl={mobileLogoUrl}
          navItems={settings?.navItems || []}
        />
        <main>{children}</main>
        <SiteFooter siteSettings={settings} />
      </body>
    </html>
  );
}
