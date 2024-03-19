export default async function getAllPosts() {
  const result = await fetch(
    `http://127.0.0.1:5500/localServerCheck/placeholder.json`,
    {
      // cache: "no-store",
      // cache: "force-cache",  Default Behaviour
      // next:{
      //   revalidate:10;  It will revalidate means refreshs if there is new data after 10 seconds
      // }
    }
  );
  return result.json();
}
