import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    removeNotification() {
      return null
    },
  },
})

export const { setNotification, removeNotification } = notificationSlice.actions

export const createNotification = (message, timeout) => {
  return (dispatch) => {
    dispatch(setNotification(message))
    setTimeout(() => {
      dispatch(removeNotification())
    }, timeout * 1000)
  }
}

export default notificationSlice.reducer
