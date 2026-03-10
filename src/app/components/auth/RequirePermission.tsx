import { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { authRepo } from '@/data/repos/authRepo';
import { profilesRepo } from '@/data/repos/profilesRepo';

interface RequirePermissionProps {
  children: ReactNode;
  requireSuperadmin?: boolean;
}

export function RequirePermission({ children, requireSuperadmin = false }: RequirePermissionProps) {
  const user = authRepo.getCurrentUserSync();

  // Si no hay usuario, redirigir a login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si usuario está deshabilitado, redirigir al home
  if (user.status === 'disabled') {
    return <Navigate to="/" replace />;
  }

  // Si requiere acceso a Superadmin
  if (requireSuperadmin) {
    if (!profilesRepo.canAccessSuperadminTabSync(user)) {
      return <Navigate to="/hub" replace />;
    }
  }

  return <>{children}</>;
}