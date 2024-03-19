// import getPostComment from "../../lib/getPostComment";
const Comments = async ({ promise }) => {
  const comment = await promise;
  return (
    <div className="mt-10">
      <ul className="mt-10">
        {comment.map((comment) => (
          <li key={comment.id}>{comment.body}</li>
        ))}
      </ul>
    </div>
  );
};

export default Comments;
