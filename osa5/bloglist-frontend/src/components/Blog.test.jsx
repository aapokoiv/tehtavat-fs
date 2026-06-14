import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog.jsx'

test('all info but no buttons shown for not logged in users', () => {
  const blog = {
    "title": "This is a testing blog",
    "author": "Aapo Koivula",
    "url": "www.testing.react",
    "likes": 1,
    user: {
      id: 'user-1',
      name: 'Aapo Koivula',
      username: 'aapo'
    }
  }

  render(<Blog blog={blog} />)

  const title = screen.findByText("This is a testing blog")
  const author = screen.findByText("Aapo Koivula")
  const url = screen.findByText('www.testing.react')
  const likes = screen.findByText('likes: 1')

  expect(screen.queryByRole('button')).not.toBeInTheDocument()
})

test('like button but no delete button is shown for other users', async () => {
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
    id: 'user-2',
    name: 'onni onnekas',
    username: 'onni'
  }

  render(<Blog blog={blog} user={loggedInUser} />)

  const user = userEvent.setup()
  const likeButton = screen.getByText('like')
})

test('blog creator is shown like and delete button', async () => {
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

  render(<Blog blog={blog} user={loggedInUser} />)

  const user = userEvent.setup()
  const likeButton = screen.getByText('like')

  const deleteButton = screen.getByText('delete')
})

