import { useState, useEffect } from 'react'
import Blog from './components/Blog.jsx'
import blogService from './services/blogs.js'
import LoginForm from './components/Login.jsx'
import loginService from './services/login.js'
import NewBlogForm from './components/NewBlogForm.jsx'
import Notification from './components/Notification.jsx'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState({ message: null, type: ''})
  
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

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
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      setUser(user)
      blogService.setToken(user.token)
      setMessage({ message: 'Logged in successfully', type: 'success'})
      setTimeout(() => {
        setMessage({ message: null, type: ''})
      }, 5000)
    } catch (error) {
      setMessage({ message: 'wrong username or password', type: 'error'})
      setTimeout(() => {
        setMessage({ message: null, type: ''})
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  const handleNewBlog = async event => {
    event.preventDefault()
    const newBlog = {
      title: title,
      author: author,
      url: url
    }
    try {
      const addedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(addedBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
      setMessage({ message: `Added: '${newBlog.title}' by '${newBlog.author}'`, type: 'success'})
      setTimeout(() => {
        setMessage({ message: null, type: ''})
      }, 5000)
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || 'Failed adding blog'
      setMessage({ message: errorMessage, type: 'error'})
      setTimeout(() => {
        setMessage({ message: null, type: ''})
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
      <h2>create new</h2>
      <NewBlogForm
        title={title}
        setTitle={setTitle}
        author={author}
        setAuthor={setAuthor}
        url={url}
        setUrl={setUrl}
        handleNewBlog={handleNewBlog}
      />
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
