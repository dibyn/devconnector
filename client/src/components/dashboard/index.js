import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getCurrentProfile } from '../../actions/profile'
import { loadUser } from '../../actions/auth'
import Spinner from './../layout/Spinner'
import DashboardActions from './DashboardActions'
const Dashboard = () => {
  const dispatch = useDispatch()
  const {
    authentication: { user },
    profile: { profile, loading },
  } = useSelector((state) => state)
  useEffect(() => {
    dispatch(loadUser())
    dispatch(getCurrentProfile())
    return () => {}
  }, [])
  return loading && user === null && profile === null ? (
    <Spinner />
  ) : (
    <div>
      <h1 className='large text-primary'>Dashboard</h1>
      <p className='lead'>
        <i className='fas fa-user'>Welcome {user?.name}</i>
      </p>
      {profile !== null ? (
        <DashboardActions />
      ) : (
        <>
          You have not yet setup a profile, please add some info.{' '}
          <Link to='/create-profile' className='btn btn-primary my-1'>
            Create profile
          </Link>
        </>
      )}
    </div>
  )
}
export default Dashboard
