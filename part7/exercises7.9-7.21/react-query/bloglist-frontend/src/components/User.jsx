import { useParams } from 'react-router-dom'
import Blog from './Blog'
import { useUser } from '../contexts/UserContext'
import { useBlog } from '../contexts/BlogContext'

const User = () => {
  const { id } = useParams()

  const { user, users } = useUser()
  const { blogs, blogsLoading, blogsError, updateBlog, deleteBlog } = useBlog()

  if (blogsLoading) return <div>Loading blogs...</div>
  if (blogsError) return <div>Error loading blogs</div>

  const viewedUser = users?.find((user) => user.id === id)

  if (!viewedUser) {
    return <div>User not found</div>
  }

  const userBlogs = blogs.filter(
    (blog) => blog.user?.id === viewedUser.id || blog.user === viewedUser.id
  )

  return (
    <div>
      <h1>{viewedUser.username}</h1>
      <h3>added blogs</h3>
      {userBlogs.length > 0 ? (
        userBlogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            updateBlog={updateBlog}
            deleteBlog={deleteBlog}
            ownerId={user?.id}
          />
        ))
      ) : (
        <p>No blogs added yet</p>
      )}
    </div>
  )
}

export default User
