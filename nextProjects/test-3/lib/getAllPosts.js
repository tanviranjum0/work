export default async function getAllPosts() {
  const result = await fetch(`https://dummyjson.com/posts`, {
    // cache: "no-store",
    // cache: "force-cache",  Default Behaviour
    // next:{
    //   revalidate:10;  It will revalidate means refreshs if there is new data after 10 seconds
    // }
  });
  return result.json();
}
