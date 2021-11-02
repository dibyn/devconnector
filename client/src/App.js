import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Landing from './components/Landing'
import Navbar from './components/Navbar'
import Register from './components/Auth/Register'
import Login from './components/Auth/Login'
import './App.css'
const App = () => {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path='/' component={Landing} />
        <section className='container'>
          <Route exact path='/register' component={Register} />
          <Route exact path='/login' component={Login} />
        </section>
      </Switch>
    </Router>
  )
}
export default App
