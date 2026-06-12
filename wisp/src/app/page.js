import Image from "next/image";
import Link from "next/link";
import { sanityFetch } from "@/sanity/live";
import { pageQuery } from "@/sanity/lib/queries";
import { SITE_URL } from "@/lib/site";
import BlockRenderer from "@/components/BlockRenderer";

// Per-page metadata override for the homepage. Falls back to the
// site-wide defaults in app/layout.js when something isn't set.
export async function generateMetadata() {
  const { data: page } = await sanityFetch({
    query: pageQuery,
    params: { slug: "home" },
  });
  // Pull the first heading-shaped string out of the page's blocks for
  // a sensible description fallback. Editors can override per-page
  // descriptions via dedicated SEO fields if/when we add them.
  const homeTitle = page?.title;
  return {
    title: homeTitle,
    alternates: { canonical: SITE_URL },
    openGraph: {
      title: homeTitle,
      url: SITE_URL,
    },
  };
}

export default async function Home() {
  const { data: page } = await sanityFetch({
    query: pageQuery,
    params: { slug: "home" },
  });

  if (!page) {
    return (
      <div className="font-sans min-h-screen p-8 sm:p-20">
        <main className="max-w-2xl mx-auto">
          <Image
            src="/logos/horizontal-wordmark.svg"
            alt="WI Space Program"
            width={600}
            height={120}
            className="mb-8 w-full h-auto invert"
            priority
          />
          <p className="text-gray-500">
            No home page yet.{" "}
            <Link href="/studio" className="underline">
              Open the Studio
            </Link>{" "}
            and create a Page with slug <code>home</code>.
          </p>
        </main>
      </div>
    );
  }

  return <BlockRenderer blocks={page.blocks} />;
}
