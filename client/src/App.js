import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'
import Landing from './components/layout/Landing'
import Navbar from './components/layout/Navbar'
import Register from './components/Auth/Register'
import Login from './components/Auth/Login'
import Alert from './components/layout/Alert'
import './App.css'
const App = () => {
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
          </section>
        </Switch>
      </Router>
    </Provider>
  )
}
export default App
