import { useSelector } from 'react-redux'
const Alert = () => {
  const alerts = useSelector((state) => state.alerts)
  return alerts ? (
    alerts.length > 0 &&
      alerts.map((a) => (
        <div key={a.id} className={`alert alert-${a.alertType}`}>
          {a.message}
        </div>
      ))
  ) : (
    <></>
  )
}
export default Alert
