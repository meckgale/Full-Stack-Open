import { Link } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { Table } from 'react-bootstrap'

const Users = () => {
  const { users, usersLoading, usersError } = useUser()

  if (usersLoading) return <div>Loading users...</div>
  if (usersError) return <div>Error loading users</div>

  return (
    <div>
      <h2>Users</h2>
      <Table striped>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.username}</Link>
              </td>
              <td>{user.blogs?.length || 0}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default Users
