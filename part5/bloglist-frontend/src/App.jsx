import { useState, useEffect, useRef } from 'react'
import { jwtDecode } from 'jwt-decode'
import Blog from './components/Blog'
import NotificationError from './components/NotificationError'
import blogService from './services/blogs'
import loginService from './services/login'
import NotificationSuccess from './components/NotificationSuccess'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(
      'loggedBlogListAppppUser'
    )
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      const userId = jwtDecode(user.token).id
      setUser({ ...user, id: userId })
      blogService.setToken(user.token)
    }
  }, [])

  const sendPost = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService.create(blogObject).then((returnedPost) => {
      setBlogs(blogs.concat(returnedPost))
      setSuccessMessage(
        `a new blog ${blogObject.title} by ${blogObject.author} added`
      )
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    })
  }

  const updateBlog = (blogObject) => {
    blogService.update(blogObject.id, blogObject).then((returnedPost) => {
      const updatedPost = {
        ...returnedPost,
        user:
          blogs.find((blog) => blog.id === returnedPost.id)?.user ||
          returnedPost.user,
      }
      setBlogs(
        blogs.map((blog) => (blog.id !== returnedPost.id ? blog : updatedPost))
      )
    })
  }

  const deleteBlog = (blogObject) => {
    blogService.remove(blogObject.id).then(() => {
      setBlogs(blogs.filter((blog) => blog.id !== blogObject.id))
    })
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })
      const userId = jwtDecode(user.token).id

      window.localStorage.setItem(
        'loggedBlogListAppppUser',
        JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser({ ...user, id: userId })
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const sortByLikes = (a, b) => b.likes - a.likes

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>log in to application</h2>
      <NotificationError message={errorMessage} />
      <div>
        username
        <input
          data-testid="username"
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          data-testid="password"
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  return (
    <div>
      {user === null ? (
        loginForm()
      ) : (
        <div>
          <h2>blogs</h2>
          <NotificationSuccess message={successMessage} />
          <p>
            {user.name} logged-in{' '}
            <button
              onClick={() => {
                window.localStorage.clear()
                setUser(null)
              }}
              type="submit"
            >
              logout
            </button>
          </p>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            {/* {blogForm()} */}
            <BlogForm createBlog={sendPost} />
          </Togglable>
          {blogs.sort(sortByLikes).map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              updateBlog={updateBlog}
              deleteBlog={deleteBlog}
              ownerId={user.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
