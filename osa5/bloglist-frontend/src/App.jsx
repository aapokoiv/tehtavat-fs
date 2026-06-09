import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog.jsx'
import blogService from './services/blogs.js'
import LoginForm from './components/Login.jsx'
import loginService from './services/login.js'
import NewBlogForm from './components/NewBlogForm.jsx'
import Notification from './components/Notification.jsx'
import Togglable from './components/Togglable.jsx'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState({ message: null, type: '' })

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      setUser(loggedUser)
      blogService.setToken(loggedUser.token)
    }
  }, [])

  const handleLogin = async credentials => {
    try {
      const user = await loginService.login(credentials)
      console.log(user)
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      setUser(user)
      blogService.setToken(user.token)
      setMessage({ message: 'Logged in successfully', type: 'success' })
      setTimeout(() => {
        setMessage({ message: null, type: '' })
      }, 5000)
    } catch {
      setMessage({ message: 'wrong username or password', type: 'error' })
      setTimeout(() => {
        setMessage({ message: null, type: '' })
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  const newBlogFormRef = useRef()

  const addBlog = async newBlog => {
    newBlogFormRef.current.toggleVisibility()
    try {
      const addedBlog = await blogService.create(newBlog)
      const blogWithUser = {
        ...addedBlog,
        user: {
          id: user.id,
          username: user.username,
          name: user.name
        }
      }
      setBlogs(blogs.concat(blogWithUser))
      setMessage({ message: `Added: '${newBlog.title}' by '${newBlog.author}'`, type: 'success' })
      setTimeout(() => {
        setMessage({ message: null, type: '' })
      }, 5000)
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || 'Failed adding blog'
      setMessage({ message: errorMessage, type: 'error' })
      setTimeout(() => {
        setMessage({ message: null, type: '' })
      }, 5000)
    }
  }

  const updateBlog = async (blogId, newBlog) => {
    try {
      const updatedBlog = await blogService.update(blogId, newBlog)
      setBlogs(currentBlogs => currentBlogs.map(blog => blog.id === blogId ? { ...updatedBlog, user: blog.user } : blog))
      setMessage({ message: `Liked: '${newBlog.title}' by '${newBlog.author}'`, type: 'success' })
      setTimeout(() => {
        setMessage({ message: null, type: '' })
      }, 5000)
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || 'Failed updating blog'
      setMessage({ message: errorMessage, type: 'error' })
      setTimeout(() => {
        setMessage({ message: null, type: '' })
      }, 5000)
    }
  }

  const deleteBlog = async (blogId) => {
    try {
      await blogService.remove(blogId)
      setBlogs(blogs.filter(blog => blog.id !== blogId))
      setMessage({ message: 'Deleted successfully', type: 'success' })
      setTimeout(() => {
        setMessage({ message: null, type: '' })
      }, 5000)
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || 'Failed deleting blog'
      setMessage({ message: errorMessage, type: 'error' })
      setTimeout(() => {
        setMessage({ message: null, type: '' })
      }, 5000)
    }
  }


  if (user === null) {
    return (
      <div>
        <h2>Log in</h2>
        <Notification
          message={message.message}
          type={message.type}
        />
        <LoginForm
          handleLogin={handleLogin}
        />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification
        message={message.message}
        type={message.type}
      />
      <p>{user.name} logged in <button onClick={() => handleLogout()}>Logout</button></p>
      <Togglable buttonLabel='create new blog' ref={newBlogFormRef}>
        <NewBlogForm
          createBlog={addBlog}
        />
      </Togglable>
      {([...blogs].sort((a, b) => b.likes - a.likes)).map(blog =>
        <Blog key={blog.id} blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog} user={user}/>
      )}
    </div>
  )
}

export default App
