import { useRef } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import BlogList from './components/BlogList'
import BlogView from './components/BlogView'
import Users from './components/Users'
import User from './components/User'
import Togglable from './components/Togglable'
import Navigation from './components/Navigation'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import { useUser } from './contexts/UserContext'
import Notification from './components/Notification'
import { useBlog } from './contexts/BlogContext'

const App = () => {
  const { user } = useUser()
  const blogFormRef = useRef()

  const { blogsLoading, blogsError } = useBlog()

  const toggleBlogForm = () => {
    blogFormRef.current.toggleVisibility()
  }

  if (blogsLoading) return <div>Loading blogs...</div>
  if (blogsError) return <div>Error loading blogs</div>

  return (
    <Router>
      {user ? (
        <div className="container">
          <Navigation />
          <div>
            <h2>blog app</h2>
            <Notification />

            <Routes>
              <Route path="/users/:id" element={<User />} />
              <Route path="/users" element={<Users />} />
              <Route path="/blogs/:id" element={<BlogView />} />
              <Route
                path="/"
                element={
                  <>
                    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
                      <BlogForm toggleVisibility={toggleBlogForm} />
                    </Togglable>
                    <BlogList />
                  </>
                }
              />
            </Routes>
          </div>
        </div>
      ) : (
        <>
          <h2>Log in to application</h2>
          <Notification />
          <LoginForm />
        </>
      )}
    </Router>
  )
}

export default App
