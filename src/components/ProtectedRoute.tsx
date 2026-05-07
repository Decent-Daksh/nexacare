import { ReactNode } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth, Role } from '../lib/auth'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles: Role[]
}

/**
 * ProtectedRoute Guard
 * Wraps route components to restrict access based on user role.
 * Redirects to /unauthorized if the user lacks the required role.
 */
export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // 1. If not logged in, send to login (or dashboard as a safe fallback)
    if (!isAuthenticated) {
      navigate({ to: '/' })
      return
    }

    // 2. If role is not authorized, redirect to unauthorized page
    if (user && !allowedRoles.includes(user.role)) {
      navigate({ to: '/unauthorized' })
    }
  }, [isAuthenticated, user, allowedRoles, navigate])

  // Only render children if the role is allowed
  if (user && allowedRoles.includes(user.role)) {
    return <>{children}</>
  }

  // Render nothing while the redirect is processing
  return null
}