import { useState, useEffect } from 'react'

import {
  Routes, Route, Link, useMatch, useNavigate
} from 'react-router-dom'
import styled from 'styled-components'

import Blog from './components/Blog.jsx'
import blogService from './services/blogs.js'
import LoginForm from './components/LoginForm.jsx'
import NewBlogForm from './components/NewBlogForm.jsx'
import Notification from './components/Notification.jsx'
import BlogList from './components/BlogList.jsx'
import { Button, colors } from './components/sharedStyles.js'

const AppShell = styled.div`
  background: #fff;
  color: ${colors.charcoalBrown};
  font-family: system-ui, sans-serif;
  min-height: 100vh;
  padding: 1.5rem;
`

const NavBar = styled.nav`
  align-items: center;
  background: ${colors.charcoalBrown};
  border-radius: 1rem;
  box-shadow: 0 0.4rem 0 ${colors.softBlossom};
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding: 0.75rem;
`

const NavLink = styled(Link)`
  border-radius: 999px;
  color: ${colors.aliceBlue};
  font-weight: 700;
  padding: 0.55rem 1.0rem;
  text-decoration: none;

  &:hover {
    background: ${colors.skyAqua};
    color: ${colors.charcoalBrown};
  }
`

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState({ message: null, type: '' })
  const navigate = useNavigate()

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

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
    navigate('/')
  }

  const addBlog = async newBlog => {
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
      navigate('/')
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
      user !== null
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
      navigate('/')
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || 'Failed deleting blog'
      setMessage({ message: errorMessage, type: 'error' })
      setTimeout(() => {
        setMessage({ message: null, type: '' })
      }, 5000)
    }
  }

  const match = useMatch('/blogs/:id')

  const blog = match
    ? blogs.find(note => note.id === match.params.id)
    : null

  return (
    <AppShell>
      <NavBar>
        <NavLink to="/">blogs</NavLink>
        {user &&
          <NavLink to="/create">new blog</NavLink>
        }
        {!user &&
          <NavLink to="/login">login</NavLink>
        }
        {user && <Button onClick={() => handleLogout()}>logout</Button>}
      </NavBar>
      <Notification
        message={message.message}
        type={message.type}
      />

      <Routes>
        <Route path="/" element={<BlogList blogs={blogs} />} />
        <Route path="/login" element={
          <LoginForm setMessage={setMessage} setUser={setUser} />
        } />
        <Route path="create" element={
          <NewBlogForm createBlog={addBlog}
          />
        } />
        <Route path="blogs/:id" element={
          <Blog
            blog={blog}
            updateBlog={updateBlog}
            deleteBlog={deleteBlog}
            user={user}
          />
        } />
      </Routes>
    </AppShell>
  )
}

export default App
