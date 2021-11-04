import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCurrentProfile } from '../../actions/profile'
const Dashboard = () => {
  const dispatch = useDispatch()
  const { authentication, profile } = useSelector((state) => state)
  useEffect(() => {
    dispatch(getCurrentProfile())
    return () => {}
  }, [])
  return <div>Dashboard</div>
}
export default Dashboard
