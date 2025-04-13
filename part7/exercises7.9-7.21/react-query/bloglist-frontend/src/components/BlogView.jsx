import { useParams, useNavigate } from 'react-router-dom'
import { useBlog } from '../contexts/BlogContext'
import { useUser } from '../contexts/UserContext'
import useNotify from '../hooks/useNotify'
import CommentForm from './CommentForm'
import { Button } from 'react-bootstrap'

const BlogView = () => {
  const { id } = useParams()
  const { user } = useUser()
  const navigate = useNavigate()
  const notify = useNotify()

  const { blogs, blogsLoading, blogsError, updateBlog, deleteBlog } = useBlog()

  const handleLike = async (blog) => {
    const result = await updateBlog({
      ...blog,
      likes: blog.likes + 1,
    })
    if (result.success) {
      notify(`you liked '${blog.title}' by ${blog.author}`, 'success')
    }
  }

  const handleRemove = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      const result = await deleteBlog(blog)
      if (result.success) {
        notify('Blog deleted successfully', 'success')
        navigate('/')
      }
    }
  }

  if (blogsLoading) return <div>Loading blogs...</div>
  if (blogsError) return <div>Error loading blogs</div>

  const blog = blogs.find((b) => b.id === id)

  if (!blog) {
    return <div>Blog not found</div>
  }

  const isOwner = blog.user?.id === user?.id || blog.user === user?.id

  return (
    <div>
      <h1>
        {blog.title} {blog.author}
      </h1>
      <div>
        <a
          href={blog.url.startsWith('http') ? blog.url : `https://${blog.url}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {blog.url}
        </a>
      </div>
      <div>
        {blog.likes} likes
        <Button onClick={() => handleLike(blog)}>like</Button>
      </div>
      <div>added by {blog.user?.name || 'unknown'}</div>
      {isOwner && <Button onClick={() => handleRemove(blog)}>remove</Button>}
      <h3>comments</h3>
      {blog.comments && blog.comments.length > 0 ? (
        <ul>
          {blog.comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
      ) : (
        <p>No comments yet</p>
      )}
      <CommentForm />
    </div>
  )
}

export default BlogView
