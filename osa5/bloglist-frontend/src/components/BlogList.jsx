import { Link } from 'react-router-dom'

const BlogList = ({ blogs }) => {
  return (
    <div>
      <h2>blogs</h2>
      {([...blogs].sort((a, b) => b.likes - a.likes)).map(blog =>
        <li key={blog.id}>
          <Link to={`blogs/${blog.id}`}>{blog.title}, -{blog.author}</Link>
        </li>
      )}
    </div>
  )
}

export default BlogList
