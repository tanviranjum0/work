export default async function getPost(id) {
  const result = await fetch(`https://dummyjson.com/posts/${id}`);
  return result.json();
}
