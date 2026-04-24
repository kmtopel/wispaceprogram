import { notFound } from "next/navigation";
import { client } from "@/sanity/client";
import { pageQuery } from "@/sanity/lib/queries";
import BlockRenderer from "@/components/BlockRenderer";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = await client.fetch(pageQuery, { slug });
  return { title: page?.title ?? "Not found" };
}

export default async function DynamicPage({ params }) {
  const { slug } = await params;

  // Reserve /home — it should live at / instead of /home.
  if (slug === "home") notFound();

  const page = await client.fetch(pageQuery, { slug });
  if (!page) notFound();

  return <BlockRenderer blocks={page.blocks} />;
}
