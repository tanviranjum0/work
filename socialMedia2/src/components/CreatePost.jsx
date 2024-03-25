import { useRef, useContext } from "react";
import { PostList } from "../store/PostListStore";
export default function CreatePost(PostList) {
  const { addPost } = useContext();
  const userId = useRef();
  const postTitle = useRef();
  const postBody = useRef();
  const reactions = useRef();
  const tags = useRef();
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div>
      <form className="create-post" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className=" p-1 htmlForm-label">
            User Id
          </label>
          <input
            type="email"
            ref={userId}
            className="htmlForm-control w-100"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="User id"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className=" p-1 htmlForm-label">
            Post Title
          </label>
          <input
            ref={postTitle}
            type="email"
            className="htmlForm-control w-100"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="How are you feeling today!"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className=" p-1 htmlForm-label">
            Post Cotent
          </label>
          <textarea
            ref={postBody}
            type="email"
            rows="4"
            className="htmlForm-control w-100"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Describe"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className=" p-1 htmlForm-label">
            Reactions
          </label>
          <input
            ref={reactions}
            type="number"
            className="htmlForm-control w-100"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Number of Reactions"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className=" p-1 htmlForm-label">
            Tags
          </label>
          <input
            ref={tags}
            type="email"
            className="htmlForm-control w-100"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Enter your tags here"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Post
        </button>
      </form>
    </div>
  );
}
