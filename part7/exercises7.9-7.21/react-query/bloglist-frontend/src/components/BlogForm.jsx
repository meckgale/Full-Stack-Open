import useField from '../hooks/useField'
import { useBlog } from '../contexts/BlogContext'
import useNotify from '../hooks/useNotify'
import { Button, Form } from 'react-bootstrap'

function BlogForm({ toggleVisibility }) {
  const title = useField('text')
  const author = useField('text')
  const url = useField('text')

  const { createBlog } = useBlog()

  const notify = useNotify()

  const onCreate = async (event) => {
    event.preventDefault()
    const blog = {
      title: title.inputTexts.value,
      author: author.inputTexts.value,
      url: url.inputTexts.value,
    }
    const result = await createBlog(blog)

    if (result.success) {
      notify(
        `a new blog ${title.inputTexts.value} by ${author.inputTexts.value} added`,
        'success'
      )
      toggleVisibility()
      title.clear()
      author.clear()
      url.clear()
    } else {
      notify(`Error creating blog: ${result.error}`, 'error')
    }
  }

  return (
    <div className="formDiv">
      <h2>Create a new blog</h2>

      <Form onSubmit={onCreate}>
        <Form.Group>
          <Form.Label>title:</Form.Label>
          <Form.Control
            data-testid="testurl"
            {...title.inputTexts}
            placeholder="title..."
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>author:</Form.Label>
          <Form.Control {...author.inputTexts} placeholder="author..." />
        </Form.Group>
        <Form.Group>
          <Form.Label>url:</Form.Label>
          <Form.Control {...url.inputTexts} placeholder="type url here" />
        </Form.Group>
        <Button type="submit">create</Button>
      </Form>
    </div>
  )
}

export default BlogForm
