import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import {
  removeNotification,
  setNotification,
} from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(({ keywordFilter, anecdotes }) => {
    if (keywordFilter) {
      return anecdotes.filter((anecdote) =>
        anecdote.content.toLowerCase().includes(keywordFilter.toLowerCase())
      )
    }
    return anecdotes
  })

  const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes)
  return (
    <div>
      {sortedAnecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button
              onClick={() => {
                dispatch(voteAnecdote(anecdote.id))
                dispatch(setNotification(`You voted '${anecdote.content}'`))
                setTimeout(() => {
                  dispatch(removeNotification())
                }, 5000)
              }}
            >
              vote
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
