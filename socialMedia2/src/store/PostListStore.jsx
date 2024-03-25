/* eslint-disable react/prop-types */
import { createContext, useReducer } from "react";

const DEFAULT_CONTEXT = {
  postList: [],
  addPost: () => {},
  deletePost: () => {},
};
export const PostList = createContext(DEFAULT_CONTEXT);
const postListReducer = (currentPostList, action) => {
  let newPostList = currentPostList;
  if (action.type === "DELETE_POST") {
    newPostList = currentPostList.filter(
      (post) => post.id !== action.payload.postId
    );
  }
  return newPostList;
};

const PostListProvider = ({ children }) => {
  const [postList, dispatchPostList] = useReducer(
    postListReducer,
    DEFAULT_POST_LIST
  );
  const addPost = () => {};
  const deletePost = (postId) => {
    dispatchPostList({
      type: "DELETE_POST",
      payload: {
        postId,
      },
    });
  };

  return (
    <PostList.Provider
      value={{
        postList: postList,
        addPost: addPost,
        deletePost: deletePost,
      }}
    >
      {" "}
      {children}
    </PostList.Provider>
  );
};
const DEFAULT_POST_LIST = [
  {
    id: "1",
    title: "Go to mumbai",
    body: "hey there how are you i am fine thank you ",
    reactions: 4,
    userId: "user-9",
    tags: ["vacation", "mumbai"],
  },
  {
    id: "2",
    title: "Go to passed",
    body: "hey there how are you i am going to pass the exam ",
    reactions: 3,
    userId: "user-3",
    tags: ["pass", "B.tech"],
  },
];
export default PostListProvider;
