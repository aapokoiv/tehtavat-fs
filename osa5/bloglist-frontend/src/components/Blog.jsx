import { useState } from 'react'
import './Blog.css'

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {
  const [showAll, setShowAll] = useState(false)

  const likeBlog = () => {
    const newBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1
    }
    updateBlog(blog.id, newBlog)
  }

  const removeBlog = () => {
    if (window.confirm(`Remove ${blog.title}?`)) {
      deleteBlog(blog.id)
    }
  }

  const allInfo = () => (
    <>
      <div>
        {blog.url}
      </div>
      <div>
        likes {blog.likes}
        <button onClick={() => likeBlog()}>like</button>
      </div>
      <div>
        {blog.user.name}
      </div>
      {ownedByUser() && <button onClick={removeBlog}>delete</button>}
    </>
  )

  const toggleShowAll = () => {
    setShowAll(!showAll)
  }

  const ownedByUser = () => user.id === blog.user.id

  return (
    <div className={'blog'}>
      <div>
        {blog.title}, -{blog.author}
        <button
          onClick={toggleShowAll}>
          {showAll ? 'hide' : 'show'}
        </button>
      </div>
      {showAll && allInfo()}
    </div>
  )
}

export default Blog
