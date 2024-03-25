/* eslint-disable react/prop-types */
import { MdDelete } from "react-icons/md";
import { PostList } from "../store/PostListStore";
import { useContext } from "react";
const Post = ({ post }) => {
  const { deletePost } = useContext(PostList);
  return (
    <div>
      <div className="card post-card" style={{ width: "30rem" }}>
        <div className="card-body">
          <h5 className="card-title">
            {post.title}{" "}
            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              onClick={() => deletePost(post.id)}
            >
              <MdDelete />
            </span>
          </h5>
          <p className="card-text">{post.body}</p>
          {post.tags.map((tag) => (
            <span key={tag} className="hashtag badge text-bg-primary">
              {tag}
            </span>
          ))}
          <div className="alert alert-success reactions" role="alert">
            This post has been reacted by {post.reactions} people
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
