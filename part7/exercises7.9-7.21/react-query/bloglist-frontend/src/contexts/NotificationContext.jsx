import { createContext, useReducer, useContext } from 'react'

const initialState = {
  message: null,
  type: null,
}

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return {
        message: action.payload?.message || null,
        type: action.payload?.type || 'info',
      }
    case 'REMOVE':
      return initialState
    default:
      return state
  }
}

const NotificationContext = createContext({
  notification: initialState,
  dispatch: () => null,
})

export const NotificationProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, initialState)

  const value = {
    notification,
    dispatch,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () =>
  useContext(NotificationContext).notification
export const useNotificationDispatch = () =>
  useContext(NotificationContext).dispatch

export default NotificationContext
