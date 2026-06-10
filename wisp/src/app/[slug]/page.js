import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/live";
import { pageQuery } from "@/sanity/lib/queries";
import BlockRenderer from "@/components/BlockRenderer";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { data: page } = await sanityFetch({
    query: pageQuery,
    params: { slug },
  });
  return { title: page?.title ?? "Not found" };
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
