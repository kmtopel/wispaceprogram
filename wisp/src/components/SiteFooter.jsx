import NewsletterForm from "@/components/NewsletterForm";
import CookiePreferencesLink from "@/components/CookiePreferencesLink";
import RichString from "@/components/RichString";

// Brand glyphs for the social link row. SVG path data simplified to single
// `<path>` shapes so we can swap fill via currentColor and keep the markup
// light. Each icon is designed for a 24×24 viewBox.
const ICONS = {
  // Outline-style Instagram glyph — three primitives (square, lens, dot)
  // crisper than a complex single-path version at small sizes.
  instagram: (
    <>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" />
    </>
  ),
  bandcamp: <path d="M0 18.75 7.437 5.25H24l-7.438 13.5H0z" />,
  youtube: (
    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.6 3.6 12 3.6 12 3.6s-7.6 0-9.4.5A3 3 0 0 0 .5 6.2C0 8 0 12 0 12s0 4 .5 5.8a3 3 0 0 0 2.1 2.1c1.8.5 9.4.5 9.4.5s7.6 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 16 24 12 24 12s0-4-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" />
  ),
  spotify: (
    <path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm5.5 17.3a.75.75 0 0 1-1 .25c-2.8-1.7-6.3-2.1-10.5-1.15a.75.75 0 1 1-.33-1.46c4.55-1 8.4-.56 11.5 1.36a.75.75 0 0 1 .33 1zm1.47-3.27a.94.94 0 0 1-1.3.31c-3.2-2-8.07-2.55-11.85-1.4a.94.94 0 1 1-.55-1.8c4.32-1.3 9.7-.7 13.4 1.6a.94.94 0 0 1 .3 1.3zm.13-3.4C15.3 8.36 8.66 8.16 5.1 9.24a1.13 1.13 0 1 1-.66-2.16c4.1-1.24 11.4-1 15.7 1.55a1.13 1.13 0 1 1-1.14 1.95z" />
  ),
  appleMusic: (
    <path d="M22.5 5.5c0-3-1.5-4.5-4.5-4.5H6C3 1 1.5 2.5 1.5 5.5v13c0 3 1.5 4.5 4.5 4.5h12c3 0 4.5-1.5 4.5-4.5v-13zm-5.7-.2c.2-.06.45.1.45.34v11.4c0 1.86-1.5 3.36-3.36 3.36s-3.36-1.5-3.36-3.36 1.5-3.36 3.36-3.36c.5 0 .96.1 1.38.3v-7.3l-6.2 1.6v8.2c0 1.86-1.5 3.36-3.36 3.36S2.34 18.4 2.34 16.54s1.5-3.36 3.36-3.36c.5 0 .96.1 1.38.3V5.1l9.72-2.5z" />
  ),
  facebook: (
    <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.5-3.88 3.77-3.88 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12z" />
  ),
  tiktok: (
    <path d="M19.6 6.74a5.74 5.74 0 0 1-3.45-1.16 5.7 5.7 0 0 1-2.2-3.58h-3.46v14.16a3.27 3.27 0 1 1-2.27-3.1V9.6a6.7 6.7 0 1 0 5.74 6.62V9.27a9.13 9.13 0 0 0 5.64 1.92V7.74a5.7 5.7 0 0 1-0-.0z" />
  ),
  twitter: (
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.21-6.815L4.99 21.75H1.68l7.73-8.835L1.254 2.25h6.83l4.713 6.231 5.447-6.231zm-1.161 17.52h1.834L7.084 4.126H5.117L17.083 19.77z" />
  ),
  other: (
    // Generic external-link glyph
    <path d="M14 4h6v6m0-6L10 14m-6-2v6a2 2 0 0 0 2 2h6" />
  ),
};

const PLATFORM_META = {
  instagram: { label: "Instagram" },
  bandcamp: { label: "Bandcamp" },
  youtube: { label: "YouTube" },
  spotify: { label: "Spotify" },
  appleMusic: { label: "Apple Music" },
  facebook: { label: "Facebook" },
  tiktok: { label: "TikTok" },
  twitter: { label: "X / Twitter" },
  other: { label: "Link" },
};

function SocialIcon({ platform }) {
  const path = ICONS[platform] || ICONS.other;
  const isStroke = platform === "other";
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill={isStroke ? "none" : "currentColor"}
      stroke={isStroke ? "currentColor" : undefined}
      strokeWidth={isStroke ? 2 : undefined}
      strokeLinecap={isStroke ? "round" : undefined}
      strokeLinejoin={isStroke ? "round" : undefined}
      aria-hidden="true"
    >
      {path}
    </svg>
  );
}

// Server component — gets its data passed in from layout.js so we can
// avoid an extra Sanity fetch.
export default function SiteFooter({ siteSettings }) {
  const socialLinks = siteSettings?.socialLinks || [];
  const footerText = siteSettings?.footerText;
  // Newsletter copy is editable in Site Settings → Footer newsletter signup.
  // No fallback copy — editors get the empty state if they leave fields blank.
  const newsletter = siteSettings?.footerNewsletter || {};

  return (
    <footer className="mt-16 sm:mt-24 border-t border-foreground/10">
      <div className="max-w-5xl mx-auto px-6 py-12 sm:py-16 flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
        {/* Signup */}
        <div className="flex-1 max-w-md">
          {newsletter.heading && (
            <RichString
              as="h2"
              value={newsletter.heading}
              className="text-xl sm:text-2xl font-bold mb-2"
            />
          )}
          {newsletter.subheading && (
            <RichString
              as="p"
              value={newsletter.subheading}
              className="text-sm text-foreground/70 mb-4"
            />
          )}
          <NewsletterForm
            compact
            buttonLabel={newsletter.buttonLabel}
            placeholder={newsletter.placeholder}
            successMessage={newsletter.successMessage}
          />
        </div>

        {/* Social links — icon row. Labels are sr-only + native title for
            tooltip on hover. */}
        {socialLinks.length > 0 && (
          <nav aria-label="Social links">
            <h2 className="text-sm uppercase tracking-wide text-foreground/50 mb-3">
              Follow
            </h2>
            <ul className="flex flex-wrap gap-3">
              {socialLinks.map((link, i) => {
                const platform = link.platform || "other";
                const meta = PLATFORM_META[platform] || PLATFORM_META.other;
                const label = link.label || meta.label;
                return (
                  <li key={link._key || i}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={label}
                      aria-label={label}
                      className="flex items-center justify-center h-10 w-10 rounded-full border border-foreground/15 text-foreground hover:bg-foreground hover:text-background hover:border-foreground transition-colors duration-300 ease-out"
                    >
                      <SocialIcon platform={platform} />
                      <span className="sr-only">{label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </div>

      <div className="border-t border-foreground/5">
        <div className="max-w-5xl mx-auto px-6 py-6 text-xs text-foreground/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Auto-generated copyright. Year updates at request time;
              uses the site title from Sanity Settings so a rebrand
              propagates without code changes. */}
          <span>
            © {new Date().getFullYear()}{" "}
            {siteSettings?.title || "Wisconsin Space Program"}.
            All rights reserved.
          </span>
          <div className="flex items-center gap-4">
            {footerText && (
              <span className="text-foreground/40">{footerText}</span>
            )}
            <CookiePreferencesLink />
          </div>
        </div>
      </div>
    </footer>
  );
}
