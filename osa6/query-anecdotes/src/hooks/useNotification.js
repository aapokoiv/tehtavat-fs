import { useContext } from 'react'
import NotificationContext from '../NotificationContext.jsx'

const useNotification = () => useContext(NotificationContext)

export default useNotification
