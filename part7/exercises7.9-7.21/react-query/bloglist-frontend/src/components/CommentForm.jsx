import { useParams } from 'react-router-dom'
import useField from '../hooks/useField'
import { useBlog } from '../contexts/BlogContext'
import useNotify from '../hooks/useNotify'
import { Button, Form } from 'react-bootstrap'

const CommentForm = () => {
  const comment = useField('text')
  const { id } = useParams()

  const { createComment } = useBlog()

  const notify = useNotify()

  const onCreate = async (event) => {
    event.preventDefault()
    const result = await createComment(id, comment.inputTexts.value)

    if (result.success) {
      notify(`a new comment '${comment.inputTexts.value}'  added`, 'success')
      comment.clear()
    } else {
      notify(`Error creating blog: ${result.error}`, 'error')
    }
  }

  return (
    <div>
      <h3>Add a comment</h3>
      <Form onSubmit={onCreate}>
        <Form.Group>
          <Form.Control
            {...comment.inputTexts}
            placeholder="Write your comment here..."
          />
        </Form.Group>
        <Button type="submit">add comment</Button>
      </Form>
    </div>
  )
}

export default CommentForm
