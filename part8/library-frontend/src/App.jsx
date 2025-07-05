import { useEffect, useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { useApolloClient, useSubscription } from '@apollo/client'
import Notify from './components/Notify'
import LoginForm from './components/LoginForm'
import { ALL_BOOKS, BOOK_ADDED } from './queries'

// function that takes care of manipulating cache
export const updateCache = (cache, query, addedBook) => {
  // helper that is used to eliminate saving same person twice
  const uniqByTitle = (books) => {
    let seen = new Set()
    return books.filter((b) => {
      if (seen.has(b.title)) return false
      seen.add(b.title)
      return true
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByTitle(allBooks.concat(addedBook)),
    }
  })
}

const App = () => {
  const [page, setPage] = useState('authors')

  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const client = useApolloClient()

  useEffect(() => {
    const savedToken = localStorage.getItem('authors-user-token')
    if (savedToken) {
      setToken(savedToken)
    }
  }, [])

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded
      notify(`${addedBook.title} added`)
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
    },
  })

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage('authors')
  }

  const handleAddBookClick = () => {
    if (!token) {
      setPage('login')
    } else {
      setPage('add')
      setPage('add')
    }
  }

  const handleLoginClick = () => {
    setPage('login')
  }

  const handleLoginSuccess = (newToken) => {
    setToken(newToken)
    setPage('authors')
  }

  return (
    <div>
      <div>
        <Notify errorMessage={errorMessage} />
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token ? (
          <>
            <button onClick={handleAddBookClick}>add book</button>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <button onClick={handleLoginClick}>login</button>
        )}
      </div>

      <Authors show={page === 'authors'} isLoggedIn={!!token} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add' && !!token} />

      {page === 'login' && (
        <LoginForm setToken={handleLoginSuccess} setError={notify} />
      )}
    </div>
  )
}

export default App
