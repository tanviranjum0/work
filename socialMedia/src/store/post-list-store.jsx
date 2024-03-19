/* eslint-disable react/prop-types */
import { createContext, useReducer } from "react";
const DEFAULT_CONTEXT = {
  postlist: [],
  addPost: () => {},
  addInitialPost: () => {},
  deletePost: () => {},
};
export const PostList = createContext(DEFAULT_CONTEXT);
const postlistReducer = (currPostList, action) => {
  let newPostList = currPostList;
  if (action.type === "DELETE_POST") {
    newPostList = currPostList.filter(
      (post) => post.id !== action.payload.postId
    );
  } else if (action.type === "ADD_INITIAL_POSTS") {
    newPostList = action.payload.posts;
  } else if (action.type === "ADD_POST") {
    newPostList = [action.payload, ...currPostList];
  }

  return newPostList;
};
export default function PostListProvider({ children }) {
  const [postList, dispatchPostList] = useReducer(postlistReducer, []);
  const addPost = (posts) => {
    dispatchPostList({
      type: "ADD_POST",
      payload: posts,
    });
  };
  const addInitialPost = (posts) => {
    dispatchPostList({
      type: "ADD_INITIAL_POSTS",
      payload: {
        posts,
      },
    });
  };
  const deletePost = (postId) => {
    // console.log(postId);
    dispatchPostList({
      type: "DELETE_POST",
      payload: {
        postId,
      },
    });
  };
  return (
    <PostList.Provider
      value={{ postList, addPost, deletePost, addInitialPost }}
    >
      {children}
    </PostList.Provider>
  );
}
