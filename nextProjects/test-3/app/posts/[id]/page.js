import getPost from "@/lib/getPost";

const page = async ({ params }) => {
  const { id } = await params;
  const posts = await getPost(id);
  const title = posts.title;
  const body = posts.body;
  return (
    <div>
      <h2 className="text-center">{title}</h2>
      <p>{body}</p>
    </div>
  );
};

export default page;
