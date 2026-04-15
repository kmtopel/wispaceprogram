import Link from "next/link";
import { client } from "@/sanity/client";
import { postsQuery } from "@/sanity/lib/queries";

export default async function Home() {
  const posts = await client.fetch(postsQuery);

  return (
    <div className="font-sans min-h-screen p-8 sm:p-20">
      <main className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Wi Space Program</h1>

        {posts.length > 0 ? (
          <ul className="space-y-4">
            {posts.map((post) => (
              <li key={post._id} className="border-b border-gray-200 dark:border-gray-800 pb-4">
                <h2 className="text-xl font-semibold">{post.title}</h2>
                {post.publishedAt && (
                  <time className="text-sm text-gray-500">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </time>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">
            No posts yet. <Link href="/studio" className="underline">Open the Studio</Link> to create your first post.
          </p>
        )}
      </main>
    </div>
  );
}
