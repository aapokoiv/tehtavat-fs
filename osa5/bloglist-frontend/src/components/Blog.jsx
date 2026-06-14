import { useState } from 'react'
import styled from 'styled-components'
import { colors, Button } from './sharedStyles.js'

const BlogGroup = styled.div`
  background: ${colors.aliceBlue};
  border: 2px solid ${colors.charcoalBrown};
  border-radius: 1rem;
  color: ${colors.charcoalBrown};
  margin: 2rem 0;
  max-width: 32rem;
  padding: 1.5rem;
`

const BlogLine = styled.div`
  margin: 1rem 0;
`

const LikeButton = styled.button`
  background: #fff;
  color: ${colors.skyAqua};
  border: 2px solid ${colors.skyAqua};
  border-radius: 9px;
  cursor: pointer;
  padding: 0.25rem 0.5rem;

  &:hover {
    background: #eee;
  }
`

const DeleteButton = styled.button`
  background: #fff;
  color: ${colors.softBlossom};
  border: 2px solid ${colors.softBlossom};
  border-radius: 9px;
  cursor: pointer;
  padding: 0.25rem 0.5rem;

  &:hover {
    background: #eee;
  }
`

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {
  if (!blog) {
    return null
  }
  console.log(blog)

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

  const ownedByUser = () => user && user.id === blog.user.id

  return (
    <BlogGroup>
      <div>
        <h2><strong>{blog.title}</strong></h2>
      </div>
      <BlogLine>
        By {blog.author}
      </BlogLine>
      <BlogLine>
        <a href={blog.url} >{blog.url}</a>
      </BlogLine>
      <BlogLine>
        Added by: {blog.user.name}
      </BlogLine>
      <BlogLine>
        {blog.likes} Likes
        {user && <LikeButton onClick={() => likeBlog()} style={{ marginLeft: '0.5rem' }}>like</LikeButton>}
        {ownedByUser() && <DeleteButton onClick={removeBlog} style={{ marginLeft: '0.5rem' }}>delete</DeleteButton>}
      </BlogLine>
    </BlogGroup>
  )
}

export default Blog
