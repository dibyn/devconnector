import { GET_PROFILE, PROFILE_ERROR } from '../types'
const initialState = {
  profile: null,
  profiles: [],
  repos: [],
  loading: true,
  error: {},
}
const profileReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_PROFILE:
      return { ...state, profile: payload, loading: false }
    case PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      }
    default:
      return state
  }
}
export default profileReducer
