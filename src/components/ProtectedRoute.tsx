import { useUser } from '@/hooks/useAuth';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router';

interface ProtectedRouteProps {
  children: ReactNode;
  guestOnly?: boolean;
}

export default function ProtectedRoute({
  children,
  guestOnly = false,
}: ProtectedRouteProps) {
  const { data: user } = useUser();

  if (user && guestOnly) return <Navigate to={'/'} replace />;

  if (!user && !guestOnly) return <Navigate to={'/login'} replace />;

  return children;
}
