import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProfiles } from '../../actions/profile'
import ProfileItem from './ProfileItem'
import Spinner from '../layout/Spinner'
const Profiles = () => {
  const dispatch = useDispatch()
  const { profiles, loading } = useSelector((state) => state.profile)
  useEffect(() => {
    dispatch(getProfiles())
  }, [])
  return (
    <>
      {loading ? <Spinner /> : <div />}
      <h1 className='large text-primary'>Developers</h1>
      <p className='lead'>
        <i className='fab fa-connectdevelop'></i>
        Browse and connect with developers
      </p>
      <div className='profiles'>
        {profiles.length > 0 ? (
          profiles.map((profile) => <ProfileItem key={profile._id} profile={profile} />)
        ) : (
          <h4>No Profiles Found</h4>
        )}
      </div>
    </>
  )
}
export default Profiles
