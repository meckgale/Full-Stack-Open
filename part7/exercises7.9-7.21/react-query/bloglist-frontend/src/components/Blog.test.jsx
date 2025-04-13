import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

describe('<Blog />', () => {
  let container

  const blog = {
    title: 'mytest',
    author: 'johndoe',
    url: 'test@email.com',
    likes: 5,
  }

  const updateBlog = vi.fn()
  const deleteBlog = vi.fn()
  const mockHandler = vi.fn()

  beforeEach(() => {
    container = render(
      <Blog blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog} />
    ).container
  })

  test('only renders title and author but not url and number of likes at first render', () => {
    expect(screen.getByText('mytest')).toBeInTheDocument()
    expect(screen.getByText('johndoe')).toBeInTheDocument()

    expect(screen.queryByText('test@email.com')).not.toBeVisible()
    expect(screen.queryByText('5')).not.toBeVisible()
  })

  test('url and number of likes shown when button is clicked', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    expect(screen.queryByText('test@email.com')).toBeVisible()
    expect(screen.queryByText('5')).toBeVisible()
  })

  test('if the like button is clicked twice, the event handler the component received as props is called twice', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    expect(screen.queryByText('5'))
    const buttonLike = screen.getByText('like')
    await user.click(buttonLike)

    expect(screen.queryByText('6'))
    await user.click(buttonLike)

    expect(screen.queryByText('7'))

    expect(updateBlog.mock.calls).toHaveLength(2)
  })
})
