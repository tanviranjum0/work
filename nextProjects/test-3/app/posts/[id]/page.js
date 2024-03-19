import getPost from "../../lib/getPost";
// import getPostComment from "../../lib/getPostComment";
// import Comments from "../../components/Comments";
// import { Suspense } from "react";
export async function generateMetadata({ params }) {
  const { id } = params;
  const postPromise = await getPost(id);
  const title = postPromise.posts[0].title;
  const body = postPromise.posts[0].body;

  return {
    title,
    description: body,
  };
}
export default async function postPage({ params }) {
  const { id } = params;
  const postPromise = await getPost(id);

  // console.log(postPromise);
  // const commentPromise = await getPostComment(id);
  // const { post } = await postPromise;
  const title = postPromise.posts[0].title;
  const body = postPromise.posts[0].body;
  // console.log(postPromise.posts[0].id);
  // const [post, comment] = await Promise.all([postPromise, commentPromise]);
  // console.log(comment);
  return (
    <div className="mt-6">
      <div className="h2 mt-3 text-center underline">{title}</div>
      <p className="mt-3">{body}</p>

      {/* <Suspense fallback="<h1>Loading...</h1>">
        <Comments promise={commentPromise}></Comments>
      </Suspense> */}
    </div>
  );
}
