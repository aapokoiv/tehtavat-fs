import { useMessage } from './store'

const Notification = () => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10
  }
  const message = useMessage()

  if (!message) {
    return null
  }

  return <div style={style}>{message}</div>
}

export default Notification
