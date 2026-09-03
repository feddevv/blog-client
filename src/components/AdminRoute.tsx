import { useUser } from '@/hooks/useAuth';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router';

export default function AdminRoute({ children }: { children: ReactNode }) {
  const { data: user } = useUser();

  if (!user) return <Navigate to={'/login'} />;

  if (user.role !== 'ADMIN') return <Navigate to={'/'} />;

  return children;
}
