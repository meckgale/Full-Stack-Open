import { createSlice, current } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

// const anecdotesAtStart = [
//   'If it hurts, do it more often',
//   'Adding manpower to a late software project makes it later!',
//   'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
//   'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
//   'Premature optimization is the root of all evil.',
//   'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
// ]

const getId = () => (100000 * Math.random()).toFixed(0)

// const asObject = (anecdote) => {
//   return {
//     content: anecdote,
//     id: getId(),
//     votes: 0,
//   }
// }

// const initialState = anecdotesAtStart.map(asObject)

// const anecdotesReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case 'NEW_ANECDOTE':
//       return [...state, action.payload]
//     case 'VOTE_ANECDOTE': {
//       const id = action.payload.id
//       const anecdoteToVote = state.find((n) => n.id === id)
//       const votedAnecdote = {
//         ...anecdoteToVote,
//         votes: anecdoteToVote.votes + 1,
//       }
//       return state.map((anecdote) =>
//         anecdote.id !== id ? anecdote : votedAnecdote
//       )
//     }

//     default:
//       console.log('state now: ', state)
//       console.log('action', action)

//       return state
//   }
// }

// export const voteAnecdote = (id) => {
//   return {
//     type: 'VOTE_ANECDOTE',
//     payload: { id },
//   }
// }

// export const createAnecdote = (content) => {
//   return {
//     type: 'NEW_ANECDOTE',
//     payload: {
//       content,
//       id: getId(),
//       votes: 0,
//     },
//   }
// }

// export default anecdotesReducer

const anecdotesSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    // createAnecdote(state, action) {
    //   state.push(action.payload)
    // },
    // voteAnecdote(state, action) {
    //   const id = action.payload
    //   const anecdoteToVote = state.find((n) => n.id === id)
    //   const votedAnecdote = {
    //     ...anecdoteToVote,
    //     votes: anecdoteToVote.votes + 1,
    //   }
    //   return state.map((anecdote) =>
    //     anecdote.id !== id ? anecdote : votedAnecdote
    //   )
    // },
    appendAnecdotes(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    },
    updateAnecdotes(state, action) {
      const updatedAnecdote = action.payload
      return state.map((anecdote) =>
        anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote
      )
    },
  },
})

export const { appendAnecdotes, setAnecdotes, updateAnecdotes } =
  anecdotesSlice.actions

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdotes(newAnecdote))
  }
}

export const voteAnecdote = (id) => {
  console.log('voteAnecdote :', id)
  return async (dispatch, getState) => {
    const state = getState()
    console.log('current state:', state)
    const votedAnecdote = state.anecdotes.find((anecdote) => anecdote.id === id)
    try {
      const updatedAnecdote = {
        ...votedAnecdote,
        votes: votedAnecdote.votes + 1,
      }
      const response = await anecdoteService.update(id, updatedAnecdote)
      dispatch(updateAnecdotes(response))
    } catch (error) {
      console.error('Voting error:', error)
    }
  }
}

export default anecdotesSlice.reducer
