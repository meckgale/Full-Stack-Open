import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import { useState } from 'react'

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState('all')
  const { data, loading, error } = useQuery(ALL_BOOKS)

  if (!props.show) {
    return null
  }

  if (loading) {
    return <div>loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  const books = data?.allBooks || []

  const allGenres = books
    .reduce((genres, book) => {
      if (book.genres) {
        book.genres.forEach((genre) => {
          if (!genres.includes(genre)) {
            genres.push(genre)
          }
        })
      }
      return genres
    }, [])
    .sort()

  const filteredBooks =
    selectedGenre === 'all'
      ? books
      : books.filter(
          (book) => book.genres && book.genres.includes(selectedGenre)
        )

  return (
    <div>
      <h2>books</h2>

      <div>
        <button onClick={() => setSelectedGenre('all')}>all genres</button>
        {allGenres.map((genre) => (
          <button key={genre} onClick={() => setSelectedGenre(genre)}>
            {genre}
          </button>
        ))}
      </div>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
            <th>genres</th>
          </tr>
          {filteredBooks.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
              <td>{b.genres ? b.genres.join(', ') : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
