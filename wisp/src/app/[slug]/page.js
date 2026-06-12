import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/live";
import { pageQuery } from "@/sanity/lib/queries";
import { SITE_URL } from "@/lib/site";
import BlockRenderer from "@/components/BlockRenderer";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { data: page } = await sanityFetch({
    query: pageQuery,
    params: { slug },
  });
  if (!page) return { title: "Not found" };

  const canonical = `${SITE_URL}/${slug}`;
  return {
    title: page.title,
    alternates: { canonical },
    openGraph: {
      title: page.title,
      url: canonical,
    },
    twitter: {
      title: page.title,
    },
  };
}

export default async function DynamicPage({ params }) {
  const { slug } = await params;

  // Reserve /home — it should live at / instead of /home.
  if (slug === "home") notFound();

  const { data: page } = await sanityFetch({
    query: pageQuery,
    params: { slug },
  });
  if (!page) notFound();

  return <BlockRenderer blocks={page.blocks} />;
}
