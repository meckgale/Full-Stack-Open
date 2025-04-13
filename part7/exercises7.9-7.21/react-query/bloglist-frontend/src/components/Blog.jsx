import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Table } from 'react-bootstrap'

const Blog = ({ blog }) => {
  return (
    <Table striped>
      <tbody>
        <tr>
          <td>
            <Link to={`/blogs/${blog.id}`}>
              {blog.title} {blog.author}
            </Link>
          </td>
        </tr>
      </tbody>
    </Table>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
}

export default Blog
