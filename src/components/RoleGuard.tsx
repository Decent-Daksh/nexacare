import React, { ReactNode } from 'react';
import { useAuth, Role } from '../lib/auth';

interface RoleGuardProps {
  /** Roles that are permitted to see the children */
  allowedRoles: Role[];
  /** The content to display if access is granted */
  children: ReactNode;
  /** 
   * Optional fallback to display if access is denied. 
   * Defaults to —— as per requirements.
   */
  fallback?: ReactNode;
}

/**
 * RoleGuard Wrapper
 * Used to conditionally show/hide or mask UI elements based on user roles.
 */
export function RoleGuard({ 
  allowedRoles, 
  children, 
  fallback = <span className="text-muted-foreground font-mono">——</span> 
}: RoleGuardProps) {
  const { user } = useAuth();

  // If no user is logged in, or the user's role isn't in the allowed list, show fallback
  if (!user || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}