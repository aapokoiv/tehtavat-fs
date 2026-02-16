import '../index.css'

const Notification = ({ message, isGood }) => {
  if (message === null) {
    return null
  }
  return (
    <div className="message" style={{ color: isGood ? 'green' : 'red' }}>
      {message}
    </div>
  )
}

export default Notification
