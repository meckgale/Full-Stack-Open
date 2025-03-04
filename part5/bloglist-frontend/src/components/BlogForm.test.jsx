import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> calls the event handler it received as props with the right details when a new blog is created', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const title = screen.getByPlaceholderText('title...')
  const author = screen.getByPlaceholderText('author...')
  const url = screen.getByPlaceholderText('type url here')
  const createButton = screen.getByText('create')

  await user.type(title, 'a cool title')
  await user.type(author, 'john doe')
  await user.type(url, 'mytest.com')
  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)

  expect(createBlog.mock.calls[0][0].title).toBe('a cool title')
  expect(createBlog.mock.calls[0][0].author).toBe('john doe')
  expect(createBlog.mock.calls[0][0].url).toBe('mytest.com')
})
