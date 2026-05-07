import { useState, useEffect } from 'react';

// 1. Role type definition
export type Role = 'admin' | 'doctor' | 'manager';

// 2. User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

// 3. PERMISSIONS object mapping roles to specific access capabilities
export const PERMISSIONS = {
  admin: [
    'view_role_manager',
    'edit_roles',
    'view_clinical_data',
    'view_staff',
    'manage_appointments'
  ],
  doctor: [
    'view_clinical_data',
    'view_staff',
    'manage_appointments'
  ],
  manager: [
    'view_staff',
    'manage_appointments',
    'view_calendar',
    'shift_assignments'
  ],
} as const;

type Permission = (typeof PERMISSIONS)[Role][number];

/**
 * 4. useAuth() hook
 * Reads/Writes current user from localStorage for persistence
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('hms_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (userData: User) => {
    localStorage.setItem('hms_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('hms_user');
    setUser(null);
  };

  const updateRole = (newRole: Role) => {
    if (user) {
      const updatedUser = { ...user, role: newRole };
      login(updatedUser);
    }
  };

  return {
    user,
    login,
    logout,
    updateRole,
    isAuthenticated: !!user,
  };
}

/**
 * 5. hasPermission utility
 * Checks if a specific role has a designated permission
 */
export function hasPermission(role: Role, permission: string): boolean {
  const allowedPermissions = PERMISSIONS[role] as readonly string[];
  return allowedPermissions.includes(permission);
}

/**
 * 6. canViewPatientDetails utility
 * Returns true only for admin and doctor roles
 */
export function canViewPatientDetails(role: Role): boolean {
  return role === 'admin' || role === 'doctor';
}