import { useQuery } from '@apollo/client'
import { ALL_AUTHORS } from '../queries'
import UpdateAuthor from './UpdateAuthor'

const Authors = (props) => {
  const { data, loading, error } = useQuery(ALL_AUTHORS)

  if (!props.show) {
    return null
  }

  if (loading) {
    return <div>loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  const authors = data?.allAuthors || []

  return (
    <>
      <div>
        <h2>authors</h2>
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>born</th>
              <th>books</th>
            </tr>
            {authors.map((a) => (
              <tr key={a.id}>
                <td>{a.name}</td>
                <td>{a.born}</td>
                <td>{a.bookCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <UpdateAuthor show={props.show} />
    </>
  )
}

export default Authors
