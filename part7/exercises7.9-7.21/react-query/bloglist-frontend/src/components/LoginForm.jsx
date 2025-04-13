import { Button, Form } from 'react-bootstrap'
import { useUser } from '../contexts/UserContext'
import useNotify from '../hooks/useNotify'

const LoginForm = () => {
  const { username, password, dispatch, login } = useUser()
  const notify = useNotify()

  const handleLogin = async (event) => {
    event.preventDefault()

    const result = await login({ username, password })
    if (!result.success) {
      notify('wrong username or password', 'error')
    }
  }

  return (
    <Form onSubmit={handleLogin}>
      <Form.Group>
        <Form.Label>username:</Form.Label>
        <Form.Control
          data-testid="username"
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) =>
            dispatch({
              type: 'SET_CREDENTIALS',
              payload: { username: target.value, password },
            })
          }
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>password:</Form.Label>
        <Form.Control
          data-testid="password"
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) =>
            dispatch({
              type: 'SET_CREDENTIALS',
              payload: { username, password: target.value },
            })
          }
        />
      </Form.Group>
      <Button type="submit">login</Button>
    </Form>
  )
}

export default LoginForm
