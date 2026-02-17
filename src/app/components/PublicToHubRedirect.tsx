import { Navigate } from 'react-router';
import { getCurrentUser } from '@/data/mocks';

interface PublicToHubRedirectProps {
  children: React.ReactNode;
}

export function PublicToHubRedirect({ children }: PublicToHubRedirectProps) {
  const user = getCurrentUser();

  // Si el usuario está autenticado, redirigir al hub
  if (user && user.status === 'active') {
    return <Navigate to="/hub" replace />;
  }

  return <>{children}</>;
}