import { useBlog } from '../contexts/BlogContext'
import Blog from './Blog'
import { useUser } from '../contexts/UserContext'

const BlogList = () => {
  const { blogs, blogsLoading, blogsError, updateBlog, deleteBlog } = useBlog()
  const { user } = useUser()

  if (blogsLoading) return <div>Loading blogs...</div>
  if (blogsError) return <div>Error loading blogs</div>

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div>
      {sortedBlogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          updateBlog={updateBlog}
          deleteBlog={deleteBlog}
          ownerId={user?.id}
        />
      ))}
    </div>
  )
}

export default BlogList
