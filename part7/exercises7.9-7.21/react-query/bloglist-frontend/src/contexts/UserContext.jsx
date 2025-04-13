import { createContext, useReducer, useContext, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useQuery } from '@tanstack/react-query'
import loginService from '../services/login'
import usersService from '../services/users'
import { setToken } from '../services/blogs'

const initialState = {
  user: null,
  username: '',
  password: '',
}

const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      }
    case 'SET_CREDENTIALS':
      return {
        ...state,
        username: action.payload.username,
        password: action.payload.password,
      }
    case 'CLEAR_CREDENTIALS':
      return {
        ...state,
        username: '',
        password: '',
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
      }
    default:
      return state
  }
}

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState)

  const {
    data: users,
    isLoading: usersLoading,
    isError: usersError,
  } = useQuery({
    queryKey: ['users'],
    queryFn: usersService.getAllUsers,
    refetchOnWindowFocus: false,
    retry: 1,
    // Only fetch users when logged in
    enabled: !!state.user,
  })

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(
      'loggedBlogListAppppUser'
    )
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      const userId = jwtDecode(user.token).id
      dispatch({ type: 'SET_USER', payload: { ...user, id: userId } })
      setToken(user.token)
    }
  }, [])

  const login = async (credentials) => {
    try {
      const user = await loginService.login(credentials)
      const userId = jwtDecode(user.token).id

      window.localStorage.setItem(
        'loggedBlogListAppppUser',
        JSON.stringify(user)
      )
      setToken(user.token)
      dispatch({ type: 'SET_USER', payload: { ...user, id: userId } })
      dispatch({ type: 'CLEAR_CREDENTIALS' })
      return { success: true }
    } catch (exception) {
      return { success: false, error: 'wrong username or password' }
    }
  }
  const logout = () => {
    window.localStorage.clear()
    dispatch({ type: 'LOGOUT' })
  }

  const getUser = (id) => {
    return useQuery({
      queryKey: ['users', id],
      queryFn: () => usersService.getUser(id),
      refetchOnWindowFocus: false,
      retry: 1,
      // Only fetch when logged in and ID provided
      enabled: !!state.user && !!id,
    })
  }

  const contextValue = {
    user: state.user,
    username: state.username,
    password: state.password,
    users,
    usersLoading,
    usersError,
    getUser,
    dispatch,
    login,
    logout,
  }

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export default UserContext
