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
import PrivateRoute from './components/routing/PrivateRoute'
import './App.css'
if (localStorage.getItem('token')) {
  setAuthToken(localStorage.getItem('token'))
}
const App = () => {
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
            <PrivateRoute path='/dashboard' component={Dashboard} />
          </section>
        </Switch>
      </Router>
    </Provider>
  )
}
export default App
