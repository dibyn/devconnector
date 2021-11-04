import Axios from 'axios'
import { setAlert } from './alert'
import { REGISTER_SUCCESS, REGISTER_FAIL } from '../types'
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
