import axios from 'axios'
import { GET_PROFILE, PROFILE_ERROR, UPDATE_PROFILE, ACCOUNT_DELETED, CLEAR_PROFILE, LOGOUT } from '../types'
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
    error.response &&
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
      console.log({ error: error.response })
      const errors = error?.response?.data.errors
      if (errors) errors.forEach((err) => dispatch(setAlert(err.msg, 'danger')))
      error.response &&
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
    const errors = error?.response?.data.errors
    if (errors) errors.forEach((err) => dispatch(setAlert(err.msg, 'danger')))
    error.response &&
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
    console.log({ error1: error, error: error.response })
    const errors = error?.response?.data.errors
    if (errors) errors.forEach((err) => dispatch(setAlert(err.msg, 'danger')))
    error.response &&
      dispatch({
        type: PROFILE_ERROR,
        payload: {
          msg: error.response.statusText,
          status: error.response.status,
        },
      })
  }
}
// Delete experience
export const deleteExperience = (id) => async (dispatch) => {
  try {
    const response = await axios.delete(`/api/profile/experience/${id}`)
    dispatch({
      type: UPDATE_PROFILE,
      payload: response.data,
    })
    dispatch(setAlert('Experience Removed', 'success'))
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}
// Delete education
export const deleteEducation = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/profile/education/${id}`)

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    })
    dispatch(setAlert('Education Removed', 'success'))
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}
export const deleteAccount = () => async (dispatch) => {
  if (window.confirm('Are you sure? This can NOT be undone!')) {
    try {
      await axios.delete('/api/profile');
      dispatch({ type: CLEAR_PROFILE });
      dispatch({ type: ACCOUNT_DELETED });
      dispatch({ type: LOGOUT });
      dispatch(setAlert('Your account has been permanently deleted'));
    } catch (err) {
      err.response && dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  }
};
