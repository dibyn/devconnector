import axios from 'axios'
import { GET_PROFILE, PROFILE_ERROR, UPDATE_PROFILE } from '../types'
import { setAlert } from './alert'
export const getCurrentProfile = () => async (dispatch) => {
  try {
    const response = await axios.get('/api/profile/me')
    dispatch({
      type: GET_PROFILE,
      payload: response.data,
    })
  } catch (error) {
    console.log({ error })
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    })
  }
}
export const createOrUpdateProfile =
  (formData, history, edit = false) =>
  async (dispatch) => {
    try {
      const response = await axios.post('/api/profile', formData)
      dispatch({
        type: GET_PROFILE,
        payload: response.data,
      })
      dispatch(setAlert(edit ? 'Profile Upload' : 'Profile Created', 'success'))
      if (!edit) history.push('/dashboard')
    } catch (error) {
      const errors = error.response.data.errors
      if (errors) errors.forEach((err) => dispatch(setAlert(err.msg, 'danger')))
      dispatch({
        type: PROFILE_ERROR,
        payload: {
          msg: error.response.statusText,
          status: error.response.status,
        },
      })
    }
  }
export const addExperience = (formData, history) => async (dispatch) => {
  try {
    const response = await axios.put('/api/profile/experience', formData)
    dispatch({
      type: UPDATE_PROFILE,
      payload: response.data,
    })
    dispatch(setAlert('Experience Added', 'success'))
    history.push('/dashboard')
  } catch (error) {
    const errors = error.response.data.errors
    if (errors) errors.forEach((err) => dispatch(setAlert(err.msg, 'danger')))
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    })
  }
}
export const addEducation = (formData, history) => async (dispatch) => {
  try {
    const response = await axios.put('/api/profile/education', formData)
    dispatch({
      type: UPDATE_PROFILE,
      payload: response.data,
    })
    dispatch(setAlert('Education Added', 'success'))
    history.push('/dashboard')
  } catch (error) {
    const errors = error.response.data.errors
    if (errors) errors.forEach((err) => dispatch(setAlert(err.msg, 'danger')))
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    })
  }
}
