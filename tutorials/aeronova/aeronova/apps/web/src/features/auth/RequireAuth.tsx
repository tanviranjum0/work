import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from './auth-context';

/** Sends signed-out visitors to sign in, remembering where they were going. */
export const RequireAuth = () => {
  const { isSignedIn } = useAuth();
  const location = useLocation();
  if (isSignedIn) return <Outlet />;
  const next = `${location.pathname}${location.search}`;
  return <Navigate to={`/signin?next=${encodeURIComponent(next)}`} replace />;
};
