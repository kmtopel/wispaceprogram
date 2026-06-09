import Image from "next/image";
import Link from "next/link";
import { client, sanityFetchOptions } from "@/sanity/client";
import { pageQuery } from "@/sanity/lib/queries";
import BlockRenderer from "@/components/BlockRenderer";

export default async function Home() {
  const page = await client.fetch(
    pageQuery,
    { slug: "home" },
    sanityFetchOptions,
  );

  if (!page) {
    return (
      <div className="font-sans min-h-screen p-8 sm:p-20">
        <main className="max-w-2xl mx-auto">
          <Image
            src="/logos/horizontal-wordmark.svg"
            alt="WI Space Program"
            width={600}
            height={120}
            className="mb-8 w-full h-auto dark:invert"
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
