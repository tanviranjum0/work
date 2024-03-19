import Link from "next/link";
const Blog = () => {
  const blogs = [
    {
      id: 1,
      title: "blog-1",
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti perspiciatis illo doloribus nisi voluptas ratione eveniet itaque maiores velit et!",
    },
    {
      id: 2,
      title: "blog-2",
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti perspiciatis illo doloribus nisi voluptas ratione eveniet itaque maiores velit et! Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minus, velit?",
    },
  ];
  return (
    <div>
      <h2 className="mb-10">Blogs Post</h2>
      <ul>
        {blogs.map((blog) => (
          <li className="mb-5" key={blog.title}>
            <Link href={`/blogs/${blog.id}`}> {blog.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Blog;
