import Link from "next/link";
// import { usePathname } from "next/navigation";
// import clsx from "clsx";
import getAllPosts from "@/lib/getAllPosts";
export default async function Posts() {
  let { posts } = await getAllPosts();
  // const pathname = usePathname();

  return (
    <div className="mt-6">
      <div className="h1 text-center">All Posts</div>
      <ul className="mt-6">
        {posts.map((post) => (
          <li className="bg-blue-500" key={post.id}>
            <Link href={`posts/${post.id}`}>
              {post.id} - {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
