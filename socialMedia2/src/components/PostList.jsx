import Post from "./Post";
import { PostList as PostListData } from "../store/PostListStore";
import { useContext } from "react";
const PostList = () => {
  const { postList } = useContext(PostListData);
  // console.log(postList);
  return (
    <div>
      {postList.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostList;
