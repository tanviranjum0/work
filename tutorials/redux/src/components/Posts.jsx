import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { fetchPosts } from "../features/posts/postSlice"
const Posts = () => {
    const posts = useSelector((state) => state.posts)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchPosts())
    }, [dispatch])

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Posts</h2>
            {posts.isLoading && <p>Loading...</p>}
            {posts.isError && <p className="text-red-500">Error: {posts.error}</p>}
            <ul>
                {posts.posts.map(post => (
                    <li key={post.id} className="mb-2">
                        <h3 className="text-lg font-semibold">{post.title}</h3>
                        <p>{post.body}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Posts