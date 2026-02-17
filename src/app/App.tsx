import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { PublicHome } from './pages/PublicHome';
import { PublicProjectDetail } from './pages/PublicProjectDetail';
import { Login } from './pages/Login';
import { Hub } from './pages/Hub';
import { HubPerfil } from './pages/HubPerfil';
import { Superadmin } from './pages/Superadmin';
import { HomeManager } from './pages/HomeManager';
import { HomeManagerBranding } from './pages/HomeManagerBranding';
import { HomeManagerHero } from './pages/HomeManagerHero';
import { HubProjectManager } from './pages/HubProjectManager';
import { HubProjectManagerLista } from './pages/HubProjectManagerLista';
import { HubProjectManagerCrear } from './pages/HubProjectManagerCrear';
import { HubProjectManagerEditar } from './pages/HubProjectManagerEditar';
import { UsersManager } from './pages/UsersManager';
import { UsersManagerLista } from './pages/UsersManagerLista';
import { UsersManagerCrear } from './pages/UsersManagerCrear';
import { UsersManagerEditar } from './pages/UsersManagerEditar';
import { UsersManagerAccesos } from './pages/UsersManagerAccesos';
import { ProjectGateway } from './pages/ProjectGateway';
import { Users } from './pages/Users';
import { Audit } from './pages/Audit';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicToHubRedirect } from './components/PublicToHubRedirect';
import { RequirePermission } from './components/auth/RequirePermission';
import { HubAuthLayout } from './components/layouts/HubAuthLayout';
import { MainLayout } from './components/MainLayout';
import { Toaster } from '@/app/components/ui/sonner';
import '@/styles/carousel.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<PublicHome />} />
        <Route path="/projects" element={<PublicHome />} />
        <Route path="/projects/:slug" element={<PublicProjectDetail />} />
        
        {/* Login con redirección si ya está autenticado */}
        <Route 
          path="/login" 
          element={
            <PublicToHubRedirect>
              <Login />
            </PublicToHubRedirect>
          } 
        />

        {/* Rutas protegidas del Hub con nested routes */}
        <Route
          path="/hub"
          element={
            <ProtectedRoute>
              <HubAuthLayout />
            </ProtectedRoute>
          }
        >
          {/* Tab Proyectos (index) */}
          <Route index element={<Hub />} />
          
          {/* Tab Perfil */}
          <Route path="perfil" element={<HubPerfil />} />
          
          {/* Tab Superadmin (requiere permisos) */}
          <Route
            path="superadmin"
            element={
              <RequirePermission requireSuperadmin>
                <Superadmin />
              </RequirePermission>
            }
          />
          
          {/* Home Manager - Nested routes */}
          <Route
            path="superadmin/home-manager"
            element={
              <RequirePermission requireSuperadmin>
                <HomeManager />
              </RequirePermission>
            }
          >
            <Route index element={<Navigate to="logo" replace />} />
            <Route path="logo" element={<HomeManagerBranding />} />
            <Route path="carrusel-principal" element={<HomeManagerHero />} />
          </Route>
          
          {/* Hub Project Manager - Nested routes */}
          <Route
            path="superadmin/hub-project-manager"
            element={
              <RequirePermission requireSuperadmin>
                <HubProjectManager />
              </RequirePermission>
            }
          >
            <Route index element={<HubProjectManagerLista />} />
            <Route path="crear" element={<HubProjectManagerCrear />} />
            <Route path="editar/:slug" element={<HubProjectManagerEditar />} />
          </Route>
          
          {/* Users Manager - Nested routes */}
          <Route
            path="superadmin/users-manager"
            element={
              <RequirePermission requireSuperadmin>
                <UsersManager />
              </RequirePermission>
            }
          >
            <Route index element={<UsersManagerLista />} />
            <Route path="crear" element={<UsersManagerCrear />} />
            <Route path="editar/:id" element={<UsersManagerEditar />} />
            <Route path="accesos/:id" element={<UsersManagerAccesos />} />
          </Route>
          
          {/* Rutas legacy de Superadmin (mover bajo superadmin después) */}
          <Route
            path="usuarios"
            element={
              <RequirePermission requireSuperadmin>
                <Users />
              </RequirePermission>
            }
          />
          <Route
            path="auditoria"
            element={
              <RequirePermission requireSuperadmin>
                <Audit />
              </RequirePermission>
            }
          />
        </Route>

        {/* Gateway a proyecto externo (fuera del layout con tabs) */}
        <Route
          path="/hub/proyecto/:slug/gateway"
          element={
            <ProtectedRoute>
              <ProjectGateway />
            </ProtectedRoute>
          }
        />

        {/* Redirects de rutas antiguas (compatibilidad) */}
        <Route path="/hub/usuarios-old" element={<Navigate to="/hub/usuarios" replace />} />
        <Route path="/hub/auditoria-old" element={<Navigate to="/hub/auditoria" replace />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <MainLayout showSidebars={false}>
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-lg text-gray-600 mb-6">Página no encontrada</p>
          <a
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    </MainLayout>
  );
}