import { Navigate } from 'react-router';
import { authRepo } from '@/data/repos/authRepo';

interface PublicToHubRedirectProps {
  children: React.ReactNode;
}

export function PublicToHubRedirect({ children }: PublicToHubRedirectProps) {
  const user = authRepo.getCurrentUserSync();

  // Si el usuario está autenticado, redirigir al hub
  if (user && user.status === 'active') {
    return <Navigate to="/hub" replace />;
  }

  return <>{children}</>;
}