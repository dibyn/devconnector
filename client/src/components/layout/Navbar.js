import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { logout } from '../../actions/auth'
const Navbar = () => {
  const dispatch = useDispatch()
  const { loading, isAuthenticated } = useSelector(
    (state) => state.authentication
  )
  const common = (
    <li>
      <Link to='/profiles'>Developers</Link>
    </li>
  )
  const authLinks = (
    <ul>
      <li>
        <Link to='/dashboard'>
          <i className='fas fa-user' />
          <span className='hide-sm'> Dashboard</span>
        </Link>
      </li>
      <li>
        <Link to='/posts'>Posts</Link>
      </li>
      <li>
        <a href='#!' onClick={() => dispatch(logout())}>
          <i className='fas fa-sign-out-alt' />
          <span className='hide-sm'> Logout</span>
        </a>
      </li>
      {common}
    </ul>
  )
  const guestLinks = (
    <ul>
      {common}
      <li>
        <Link to='/register'>Register</Link>
      </li>
      <li>
        <Link to='/login'>Login</Link>
      </li>
    </ul>
  )
  return (
    <nav className='navbar bg-dark'>
      <h1>
        <Link to='/'>
          <i className='fas fa-code'></i> DevConnector
        </Link>
      </h1>
      {!loading && <>{isAuthenticated ? authLinks : guestLinks}</>}
    </nav>
  )
}
export default Navbar
