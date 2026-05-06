import { createRouter, createRoute } from '@tanstack/react-router';
// Import 'Route' from your root file and alias it to 'rootRoute'
import { Route as rootRoute } from './routes/__root';

// Import your page components
import Dashboard from './pages/Dashboard';
import PatientHub from './pages/PatientHub';
import StaffCommand from './pages/StaffCommand';
import UnauthorizedPage from './pages/unauthorized';
import RoleManager from './pages/admin/RoleManager';
import LoginPage from './pages/Login';

// Import your RBAC guard
import { ProtectedRoute } from './components/ProtectedRoute';

// 1. Define Public Routes
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const unauthorizedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/unauthorized',
  component: UnauthorizedPage,
});

// 2. Define Protected Dashboard Route (Accessible to all authenticated users)
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Dashboard,
});

// 3. Define Clinical Routes (Restricted to Admin and Doctor)
const patientHubRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/patients',
  component: () => (
    <ProtectedRoute allowedRoles={['admin', 'doctor']}>
      <PatientHub />
    </ProtectedRoute>
  ),
});

// 4. Define Managerial Routes (Accessible to Admin and Manager)
const staffCommandRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/staff',
  component: () => (
    <ProtectedRoute allowedRoles={['admin', 'manager']}>
      <StaffCommand />
    </ProtectedRoute>
  ),
});

// 5. Define Admin-Only Routes
const roleManagerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/roles',
  component: () => (
    <ProtectedRoute allowedRoles={['admin']}>
      <RoleManager />
    </ProtectedRoute>
  ),
});

// 6. Build the Route Tree 
// This variable MUST be declared before the 'router' uses it
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  unauthorizedRoute,
  patientHubRoute,
  staffCommandRoute,
  roleManagerRoute,
]);

// 7. Create and Export the Router
export const router = createRouter({ 
  routeTree,
  defaultPreload: 'intent',
});

// 8. Register the router for maximum Type-Safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}