import { useEffect } from 'react'
import '../styles/toast.css'

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="toast">
      {message}
    </div>
  )
}
