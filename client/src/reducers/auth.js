import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED_SUCCESS,
  AUTH_ERROR,
} from '../types'
const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: false,
  user: null,
}
const authReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case USER_LOADED_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload,
      }
    case REGISTER_SUCCESS:
      localStorage.setItem('token', payload.token)
      return { ...state, ...payload, isAuthenticated: true, loading: false }
    case AUTH_ERROR:
    case REGISTER_FAIL:
      localStorage.removeItem('token')
      return { ...state, token: null, isAuthenticated: false, loading: false }
    default:
      return state
  }
}
export default authReducer
