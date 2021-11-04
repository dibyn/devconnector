import axios from 'axios'
import { GET_PROFILE, PROFILE_ERROR } from '../types'
export const getCurrentProfile = () => async (dispatch) => {
  try {
    const response = await axios.get('/api/profile/me')
    dispatch({
      type: GET_PROFILE,
      payload: response.data,
    })
  } catch (error) {
    console.log({error})
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    })
  }
}
