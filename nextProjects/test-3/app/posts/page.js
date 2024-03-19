// "use client";
import Link from "next/link";
import getAllPosts from "../lib/getAllPosts";
export default async function Posts() {
  let { posts } = await getAllPosts();
  // console.log(posts);
  return (
    <div className="mt-6">
      <div className="h1 text-center">All Posts</div>
      <ul className="mt-6">
        {posts.map((post) => (
          <li
            className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            key={post.id}
          >
            <Link href={`posts/${post.id}`}>
              {post.id} - {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
