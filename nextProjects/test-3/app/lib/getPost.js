export default async function getPosts(id) {
  const result = await fetch(
    `http://127.0.0.1:5500/localServerCheck/placeholder/${id}.json`
  );
  return result.json();
}
