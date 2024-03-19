import { useContext, useEffect, useState } from "react";
import Post from "./Post";
import LoadingSpinner from "./LoadingSpinner";
import WelcomeMessage from "./WelcomeMessage";
import { PostList as PostListData } from "../store/post-list-store";
const Postlist = () => {
  const { postList, addInitialPost } = useContext(PostListData);
  const [fetching, setFetching] = useState(false);
  useEffect(() => {
    setFetching(true);
    const controller = new AbortController();
    const signal = controller.signal;
    fetch("https://dummyjson.com/posts", { signal })
      .then((res) => res.json())
      .then((data) => {
        addInitialPost(data.posts);
        setFetching(false);
      });
    // setFetching(false);
    return () => {
      console.log("Cleaning Effect");
      controller.abort();
    };
  }, []);

  return (
    <>
      {/* <LoadingSpinner /> */}
      {fetching && <LoadingSpinner />}
      {!fetching && postList.length === 0 && <WelcomeMessage />}
      {!fetching && postList.map((post) => <Post key={post.id} post={post} />)}
    </>
  );
};

export default Postlist;
