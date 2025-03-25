import { createSlice } from '@reduxjs/toolkit'

// const filterReducer = (state = '', action) => {
//   switch (action.type) {
//     case 'SET_FILTER':
//       return action.payload
//     default:
//       return state
//   }
// }

// export const filterChange = (keyword) => {
//   return {
//     type: 'SET_FILTER',
//     payload: keyword,
//   }
// }

// export default filterReducer

const filterSlice = createSlice({
  name: 'keywordFilter',
  initialState: '',
  reducers: {
    filterChange(state, action) {
      return action.payload
    },
  },
})

export const { filterChange } = filterSlice.actions

export default filterSlice.reducer
