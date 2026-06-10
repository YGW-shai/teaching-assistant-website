import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { useUserStore } from '../../stores/userStore'

interface RequireAuthProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export default function RequireAuth({ children, allowedRoles }: RequireAuthProps) {
  const { isAuthenticated } = useAuthStore()
  const { user } = useUserStore()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role_name)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
