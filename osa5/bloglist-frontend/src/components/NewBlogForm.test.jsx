import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewBlogForm from './NewBlogForm.jsx'

test('createBlog prop is called with correct data', async () => {
  const loggedInUser = {
    id: 'user-1',
    name: 'Aapo Koivula',
    username: 'aapo'
  }

  const createMock = vi.fn()

  render(<NewBlogForm createBlog={createMock} />)

  const user = userEvent.setup()

  const title = screen.getByLabelText('title:')
  const author = screen.getByLabelText('author:')
  const url = screen.getByLabelText('url:')
  const submitButton = screen.getByText('create')

  await user.type(title, 'Adding a blog for test')
  await user.type(author, 'UserEvent user')
  await user.type(url, 'www.usertestblog.com')
  await user.click(submitButton)

  expect(createMock.mock.calls).toHaveLength(1)
  expect(createMock.mock.calls[0][0].title).toBe('Adding a blog for test')
  expect(createMock.mock.calls[0][0].author).toBe('UserEvent user')
  expect(createMock.mock.calls[0][0].url).toBe('www.usertestblog.com')
})
