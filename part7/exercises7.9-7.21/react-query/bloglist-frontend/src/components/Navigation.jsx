import { Link } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { Button, Nav, Navbar } from 'react-bootstrap'

const Navigation = () => {
  const { user, logout } = useUser()

  const linkStyle = {
    padding: '0 10px',
  }

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="#" as="span">
            <Link style={linkStyle} to="/">
              blogs
            </Link>
          </Nav.Link>
          <Nav.Link href="#" as="span">
            <Link style={linkStyle} to="/users">
              users
            </Link>
          </Nav.Link>
          <Nav.Link href="#" as="span">
            <span>
              {user.name} logged in <Button onClick={logout}>logout</Button>
            </span>
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Navigation
