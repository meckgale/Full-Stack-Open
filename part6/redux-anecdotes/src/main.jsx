import { createRoot } from 'react-dom/client'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import App from './App'
import anecdoteReducer from './reducers/anecdoteReducer'
import filterReducer from './reducers/filterReducer'
import { combineReducers } from 'redux'
import store from './store'

// const reducer = combineReducers({
//   anecdotes: anecdoteReducer,
//   keywordFilter: filterReducer,
// })

// const store = configureStore({ reducer })

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
