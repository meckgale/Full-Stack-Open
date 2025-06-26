import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { UPDATE_AUTHOR, ALL_AUTHORS } from '../queries'

const UpdateAuthor = (props) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const { data, loading, error } = useQuery(ALL_AUTHORS)

  const [editAuthor] = useMutation(UPDATE_AUTHOR, {
    update: (cache, { data: responseData }) => {
      cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
        if (!allAuthors || !responseData?.editAuthor) {
          return { allAuthors }
        }

        const updatedAuthor = responseData.editAuthor

        return {
          allAuthors: allAuthors.map((author) =>
            author.id === updatedAuthor.id ? updatedAuthor : author
          ),
        }
      })
    },
  })

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

  const submit = async (event) => {
    event.preventDefault()

    editAuthor({
      variables: { name: name, setBornTo: parseInt(born) },
    })

    setName('')
    setBorn('')
  }
  return (
    <div>
      <form onSubmit={submit}>
        <h2>Set birthyear</h2>
        <div>
          <select value={name} onChange={({ target }) => setName(target.value)}>
            <option value="">Select an author...</option>
            {authors.map((author) => (
              <option key={author.id} value={author.name}>
                {author.name}{' '}
                {author.born ? `(born ${author.born})` : '(birth year unknown)'}
              </option>
            ))}
          </select>
        </div>
        <div>
          born
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default UpdateAuthor
