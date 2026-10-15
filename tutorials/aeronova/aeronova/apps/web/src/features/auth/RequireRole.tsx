import { Navigate, Outlet } from 'react-router';
import type { Role } from '@aeronova/shared';
import { useAuth } from './auth-context';

/**
 * Gates a route tree to one role. Sits inside <RequireAuth>, so a signed-out
 * visitor has already been redirected to sign in by the time this runs — a
 * signed-in visitor lacking the role is sent home instead, not to sign-in
 * again, since signing in again would not help them.
 */
export const RequireRole = ({ role }: { role: Role }) => {
  const { user } = useAuth();
  if (user?.roles.includes(role)) return <Outlet />;
  return <Navigate to="/" replace />;
};
