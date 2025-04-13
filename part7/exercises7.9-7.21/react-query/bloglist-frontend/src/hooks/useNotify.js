import { useNotificationDispatch } from '../contexts/NotificationContext'

export const useNotify = () => {
  const dispatch = useNotificationDispatch()

  const notify = (message, type = 'info', duration = 5000) => {
    dispatch({
      type: 'SET',
      payload: { message, type },
    })

    setTimeout(() => {
      dispatch({ type: 'REMOVE' })
    }, duration)
  }

  return notify
}

export default useNotify
