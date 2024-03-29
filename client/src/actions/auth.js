import Axios from 'axios'
import { setAlert } from './alert'
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED_SUCCESS,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_PROFILE,
} from '../types'
import setAuthToken from '../utils/setAuthToken'
import axios from 'axios'
//load user
export const loadUser = () => async (dispatch) => {
  const token = localStorage.getItem('token')
  if (token) setAuthToken(token)
  try {
    const response = await axios.get('/api/auth')
    dispatch({
      type: USER_LOADED_SUCCESS,
      payload: response.data,
    })
  } catch (error) {
    dispatch({
      type: AUTH_ERROR,
    })
  }
}
export const register = (payload) => async (dispatch) => {
  try {
    const response = await Axios.post('/api/users', payload)
    dispatch({
      type: REGISTER_SUCCESS,
      payload: response.data,
    })
  } catch (error) {
    const errors = error.response.data.errors
    if (errors) errors.forEach((err) => dispatch(setAlert(err.msg, 'danger')))
    dispatch({
      type: REGISTER_FAIL,
    })
  }
}
export const login = (payload) => async (dispatch) => {
  try {
    const response = await Axios.post('/api/auth', payload)
    dispatch({
      type: LOGIN_SUCCESS,
      payload: response.data,
    })
  } catch (error) {
    const errors = error.response.data.errors
    if (errors) errors.forEach((err) => dispatch(setAlert(err.msg, 'danger')))
    dispatch({
      type: LOGIN_FAIL,
    })
  }
}
export const logout = () => (dispatch) => {
  dispatch({ type: CLEAR_PROFILE })
  dispatch({ type: LOGOUT })
}
