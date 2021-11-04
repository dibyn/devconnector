import { useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'
import setAuthToken from './utils/setAuthToken'
import Landing from './components/layout/Landing'
import Navbar from './components/layout/Navbar'
import Register from './components/authentication/Register'
import Login from './components/authentication/Login'
import Alert from './components/layout/Alert'
import { loadUser } from './actions/auth'
import Dashboard from './components/dashboard'
import CreateProfile from './components/profile-form/CreateProfile'
import EditProfile from './components/profile-form/EditProfile'
import PrivateRoute from './components/routing/PrivateRoute'
import './App.css'
import AddEducation from './components/profile-form/AddEducation'
import AddExperience from './components/profile-form/AddExperience'
import Profiles from './components/Profiles'
const App = () => {
  const token = localStorage.getItem('token')
  if (token) setAuthToken(token)
  useEffect(() => {
    store.dispatch(loadUser())
  }, [])
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Switch>
          <Route exact path='/' component={Landing} />
          <section className='container'>
            <Alert />
            <Route exact path='/register' component={Register} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/profiles' component={Profiles} />
            <PrivateRoute path='/dashboard' component={Dashboard} />
            <PrivateRoute path='/create-profile' component={CreateProfile} />
            <PrivateRoute path='/edit-profile' component={EditProfile} />
            <PrivateRoute path='/add-education' component={AddEducation} />
            <PrivateRoute path='/add-experience' component={AddExperience} />
          </section>
        </Switch>
      </Router>
    </Provider>
  )
}
export default App
