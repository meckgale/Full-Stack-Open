import { useNotificationValue } from '../contexts/NotificationContext'

const Notification = () => {
  const notification = useNotificationValue()

  if (!notification.message) return null

  const style = {}

  if (notification.type === 'success') {
    style.value = 'alert alert-success'
  } else if (notification.type === 'error') {
    style.value = 'alert alert-danger'
  }

  return <div className={style.value}>{notification.message}</div>
}

export default Notification
