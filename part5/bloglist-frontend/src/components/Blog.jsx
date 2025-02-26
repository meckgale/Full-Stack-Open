import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlog, deleteBlog, ownerId }) => {
  const [loginVisible, setLoginVisible] = useState(false)

  const hideWhenVisible = { display: loginVisible ? 'none' : '' }
  const showWhenVisible = { display: loginVisible ? '' : 'none' }

  const updateLike = (event) => {
    event.preventDefault()
    updateBlog({
      ...blog,
      likes: blog.likes + 1,
    })
  }

  const removePost = (event) => {
    event.preventDefault()
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlog(blog)
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const buttonStyle = {
    backgroundColor: 'DodgerBlue',
  }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={() => setLoginVisible(true)}>view</button>
      </div>
      <div style={showWhenVisible}>
        <p>
          {blog.title}{' '}
          <button onClick={() => setLoginVisible(false)}>hide</button>
        </p>
        <p>{blog.url}</p>
        <p>
          {blog.likes} <button onClick={updateLike}>like</button>
        </p>
        <p>{blog.author}</p>
        {ownerId === blog.user?.id && (
          <button style={buttonStyle} onClick={removePost}>
            remove
          </button>
        )}
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  ownerId: PropTypes.string.isRequired,
}

export default Blog
