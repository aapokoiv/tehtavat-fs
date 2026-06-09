import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog.jsx'

test('only title and author are rendered by default', () => {
  const blog = {
    "title": "This is a testing blog",
    "author": "Aapo Koivula",
    "url": "www.testing.react",
    "likes": 1
  }

  render(<Blog blog={blog} />)

  const title = screen.findByText("This is a testing blog")
  const author = screen.findByText("Aapo Koivula")

  const url = screen.queryByText('www.testing.react')
  const likes = screen.queryByText('likes: 1')
  expect(url).toBeNull()
  expect(likes).toBeNull()
})

test('url and likes are rendered when "show" button is cliked', async () => {
  const blog = {
    id: 'blog-1',
    title: 'This is a testing blog',
    author: 'Aapo Koivula',
    url: 'www.testing.react',
    likes: 1,
    user: {
      id: 'user-1',
      name: 'Aapo Koivula',
      username: 'aapo'
    }
  }

  const loggedInUser = {
    id: 'user-1',
    name: 'Aapo Koivula',
    username: 'aapo'
  }

  render(<Blog blog={blog} user={loggedInUser} />)

  const user = userEvent.setup()
  const showButton = screen.getByText('show')
  await user.click(showButton)

  const url = screen.findByText('www.testing.react')
  const likes = screen.findByText('likes: 1')
})

test('liking twice calls the blog update prop twice', async () => {
  const blog = {
    id: 'blog-1',
    title: 'This is a testing blog',
    author: 'Aapo Koivula',
    url: 'www.testing.react',
    likes: 1,
    user: {
      id: 'user-1',
      name: 'Aapo Koivula',
      username: 'aapo'
    }
  }

  const loggedInUser = {
    id: 'user-1',
    name: 'Aapo Koivula',
    username: 'aapo'
  }

  const updateMock = vi.fn()

  render(<Blog blog={blog} updateBlog={updateMock} user={loggedInUser} />)

  const user = userEvent.setup()
  const showButton = screen.getByText('show')
  await user.click(showButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(updateMock.mock.calls).toHaveLength(2)
})

