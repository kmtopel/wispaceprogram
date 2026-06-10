import { defineType, defineField } from "sanity";

// Tiny SVG icon used to visually distinguish the three nav item types in
// the Studio array UI.
function NavIcon({ kind }) {
  const paths = {
    page: "M6 3h7l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm7 0v5h5",
    anchor: "M12 4v16M5 11l7 7 7-7",
    external:
      "M14 4h6v6M20 4l-9 9M19 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5",
  }[kind];
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={paths} />
    </svg>
  );
}

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  // Singleton — there should only ever be one of these.
  fields: [
    defineField({
      name: "title",
      title: "Site title",
      type: "string",
      initialValue: "WI Space Program",
    }),
    defineField({
      name: "description",
      title: "Site description",
      type: "text",
      rows: 2,
      description: "Used for SEO and social sharing.",
    }),
    defineField({
      name: "splashLogo",
      title: "Splash logo",
      type: "image",
      description:
        "Large logo shown briefly when the page loads, before collapsing to the compact header. Wide wordmark variant works best. Falls back to the bundled wordmark.",
      options: { accept: "image/svg+xml,image/png" },
    }),
    defineField({
      name: "desktopLogo",
      title: "Desktop logo",
      type: "image",
      description:
        "Shown in the site header on tablet/desktop (≥ 640px). SVG recommended. Falls back to the bundled wordmark if unset.",
      options: { accept: "image/svg+xml,image/png" },
    }),
    defineField({
      name: "mobileLogo",
      title: "Mobile logo",
      type: "image",
      description:
        "Shown in the site header on mobile (< 640px). SVG recommended. Falls back to the bundled monogram if unset.",
      options: { accept: "image/svg+xml,image/png" },
    }),
    defineField({
      name: "navItems",
      title: "Navigation",
      type: "array",
      description:
        "Header navigation items, in order. Mix internal pages, anchor jumps, and external links freely.",
      of: [
        {
          name: "navInternal",
          type: "object",
          title: "Internal page",
          icon: () => <NavIcon kind="page" />,
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "page",
              title: "Page",
              type: "reference",
              to: [{ type: "page" }],
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { label: "label", slug: "page.slug.current" },
            prepare({ label, slug }) {
              return {
                title: label || "(no label)",
                subtitle: slug ? `→ /${slug === "home" ? "" : slug}` : "(no page)",
              };
            },
          },
        },
        {
          name: "navAnchor",
          type: "object",
          title: "Anchor link",
          icon: () => <NavIcon kind="anchor" />,
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "page",
              title: "On page",
              type: "reference",
              to: [{ type: "page" }],
              description:
                "Page that contains the anchor. Leave blank to jump within the home page.",
            }),
            defineField({
              name: "anchor",
              title: "Anchor ID",
              type: "string",
              description:
                "Matches the Anchor ID set on a block (e.g. 'shows', 'music').",
              validation: (rule) =>
                rule
                  .required()
                  .custom((value) => {
                    if (!value) return true;
                    if (!/^[a-z][a-z0-9-]*$/.test(value)) {
                      return "Use lowercase letters, numbers, and hyphens.";
                    }
                    return true;
                  }),
            }),
          ],
          preview: {
            select: {
              label: "label",
              anchor: "anchor",
              slug: "page.slug.current",
            },
            prepare({ label, anchor, slug }) {
              const path = slug && slug !== "home" ? `/${slug}` : "";
              return {
                title: label || "(no label)",
                subtitle: anchor ? `→ ${path}/#${anchor}` : "(no anchor)",
              };
            },
          },
        },
        {
          name: "navExternal",
          type: "object",
          title: "External URL",
          icon: () => <NavIcon kind="external" />,
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "newTab",
              title: "Open in new tab",
              type: "boolean",
              initialValue: true,
            }),
          ],
          preview: {
            select: { label: "label", url: "url" },
            prepare({ label, url }) {
              return { title: label || "(no label)", subtitle: url };
            },
          },
        },
      ],
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              options: {
                list: [
                  { title: "Instagram", value: "instagram" },
                  { title: "Bandcamp", value: "bandcamp" },
                  { title: "YouTube", value: "youtube" },
                  { title: "Spotify", value: "spotify" },
                  { title: "Apple Music", value: "appleMusic" },
                  { title: "Facebook", value: "facebook" },
                  { title: "TikTok", value: "tiktok" },
                  { title: "X / Twitter", value: "twitter" },
                  { title: "Other", value: "other" },
                ],
              },
            }),
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description: "Override display label (optional).",
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { platform: "platform", label: "label", url: "url" },
            prepare({ platform, label, url }) {
              return { title: label || platform || url, subtitle: url };
            },
          },
        },
      ],
    }),
    defineField({
      name: "footerText",
      title: "Footer text",
      type: "string",
      description: "Shown in the site footer. Supports plain text only.",
    }),
    defineField({
      name: "footerNewsletter",
      title: "Footer newsletter signup",
      type: "object",
      description: "Copy for the newsletter form in the site footer.",
      fields: [
        defineField({
          name: "heading",
          title: "Heading",
          type: "string",
          description:
            "Basic markup allowed: <br>, <i>/<em>, <b>/<strong>, <u>, <small>.",
        }),
        defineField({
          name: "subheading",
          title: "Subheading",
          type: "string",
          description: "Same markup rules as the heading.",
        }),
        defineField({
          name: "buttonLabel",
          title: "Button label",
          type: "string",
        }),
        defineField({
          name: "placeholder",
          title: "Email placeholder",
          type: "string",
        }),
        defineField({
          name: "successMessage",
          title: "Success message",
          type: "string",
          description: "Shown after a successful signup.",
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
