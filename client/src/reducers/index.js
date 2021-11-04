import { combineReducers } from 'redux'
import alertReducer from './alert'
export default combineReducers({
  alerts: alertReducer,
})
