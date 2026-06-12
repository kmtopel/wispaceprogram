// Root layout: shared header/footer, fonts, and site-wide metadata.
import { Fraunces, Inter_Tight } from "next/font/google";
import { sanityFetch, SanityLive } from "@/sanity/live";
import { siteSettingsQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/image";
import { SITE_URL } from "@/lib/site";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Analytics from "@/components/Analytics";
import ConsentBanner from "@/components/ConsentBanner";
import SanityLiveOnPublic from "@/components/SanityLiveOnPublic";
import JsonLd from "@/components/JsonLd";
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

// Bundled SVG fallbacks if no logo has been uploaded to Site Settings.
const DEFAULT_SPLASH_LOGO = "/logos/horizontal-wordmark.svg";
const DEFAULT_DESKTOP_LOGO = "/logos/horizontal-wordmark.svg";
const DEFAULT_MOBILE_LOGO = "/logos/horizontal-monogram.svg";

// Site-wide metadata pulled from Sanity Site Settings. Per-page exports
// (in app/page.js, app/[slug]/page.js) can override title/description/og
// individually — anything they don't set falls back to these defaults.
export async function generateMetadata() {
  const { data: settings } = await sanityFetch({ query: siteSettingsQuery });

  const siteName = settings?.title || "Wisconsin Space Program";
  const siteDescription =
    settings?.description ||
    "Official site of Wisconsin Space Program.";

  // OG/Twitter share image — splash logo if uploaded, otherwise the
  // bundled wordmark. Sized appropriately for social previews.
  const ogImage = settings?.splashLogo
    ? urlFor(settings.splashLogo).width(1200).height(630).fit("crop").url()
    : `${SITE_URL}/logos/horizontal-wordmark.svg`;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: siteName,
      template: `%s — ${siteName}`,
    },
    description: siteDescription,
    openGraph: {
      title: siteName,
      description: siteDescription,
      url: SITE_URL,
      siteName,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: siteName }],
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description: siteDescription,
      images: [ogImage],
    },
    alternates: { canonical: SITE_URL },
  };
}

export default async function RootLayout({ children }) {
  const { data: settings } = await sanityFetch({
    query: siteSettingsQuery,
  });

  const splashLogoUrl = settings?.splashLogo
    ? urlFor(settings.splashLogo).url()
    : DEFAULT_SPLASH_LOGO;
  const desktopLogoUrl = settings?.desktopLogo
    ? urlFor(settings.desktopLogo).url()
    : DEFAULT_DESKTOP_LOGO;
  const mobileLogoUrl = settings?.mobileLogo
    ? urlFor(settings.mobileLogo).url()
    : DEFAULT_MOBILE_LOGO;

  // Schema.org MusicGroup — gives Google enough structured data to build
  // a Knowledge Panel and link the band to its Spotify/Bandcamp/IG
  // profiles. sameAs is the canonical way to link external identities.
  const socialUrls = (settings?.socialLinks || [])
    .map((l) => l.url)
    .filter(Boolean);
  const musicGroupSchema = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: settings?.title || "Wisconsin Space Program",
    url: SITE_URL,
    ...(settings?.description && { description: settings.description }),
    ...(settings?.splashLogo && {
      image: urlFor(settings.splashLogo).width(1200).url(),
    }),
    ...(socialUrls.length > 0 && { sameAs: socialUrls }),
  };

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
        {/* Tells Google "this is a band, here are its socials." Surfaces
            in Knowledge Panel and rich results for the band's name. */}
        <JsonLd data={musicGroupSchema} />
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
        <ConsentBanner />
        <Analytics />
        {/* SanityLive subscribes to Sanity's live API and re-fetches
            RSCs when content changes. We render it inside a client
            wrapper that suppresses it on /studio routes, where the
            refresh otherwise nukes in-progress uploads. */}
        <SanityLiveOnPublic>
          <SanityLive />
        </SanityLiveOnPublic>
      </body>
    </html>
  );
}
