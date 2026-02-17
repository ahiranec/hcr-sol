import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { HubLayout } from '../components/HubLayout';
import { ProjectStatusBadge } from '../components/ProjectStatusBadge';
import {
  getCurrentUser,
  mockProjects,
  canUserAccessProject,
  mockUiState,
  PROJECT_COPY,
  createSsoSession,
  buildSsoAdminUrl,
  mockSsoState,
} from '@/data/mocks';

export function ProjectGateway() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSsoLoading, setIsSsoLoading] = useState(false);
  const [ssoError, setSsoError] = useState<string | null>(null);
  const user = getCurrentUser();

  // Simular carga
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [slug]);

  // Estado de carga
  if (isLoading || mockUiState.loading) {
    return (
      <HubLayout>
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
            <p className="text-gray-600">Cargando...</p>
          </div>
        </div>
      </HubLayout>
    );
  }

  // Estado de error genérico
  if (mockUiState.error) {
    return (
      <HubLayout>
        <div className="flex items-center justify-center py-24">
          <div className="text-center max-w-md px-4">
            <p className="text-red-600 mb-4">Ocurrió un error al cargar el proyecto.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </HubLayout>
    );
  }

  if (!user || !slug) {
    return null;
  }

  // Buscar proyecto
  const project = mockProjects.find(p => p.slug === slug);

  // Proyecto no encontrado
  if (!project) {
    return (
      <HubLayout>
        <div className="flex items-center justify-center py-24">
          <div className="text-center max-w-md px-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Proyecto no encontrado.</h1>
            <Link
              to="/hub"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Volver a mis proyectos
            </Link>
          </div>
        </div>
      </HubLayout>
    );
  }

  // Usuario sin acceso
  const hasAccess = canUserAccessProject(user.email, user.hub_role, slug);
  if (!hasAccess) {
    return (
      <HubLayout>
        <div className="flex items-center justify-center py-24">
          <div className="text-center max-w-md px-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso denegado</h1>
            <p className="text-gray-600 mb-6">No tienes acceso a este proyecto.</p>
            <Link
              to="/hub"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Volver a mis proyectos
            </Link>
          </div>
        </div>
      </HubLayout>
    );
  }

  const projectCopy = PROJECT_COPY[project.slug];

  // Handler para SSO Light
  const handleOpenAdminPanelWithSso = async () => {
    // Verificar usuario deshabilitado
    if (user.status === 'disabled') {
      setSsoError('Tu cuenta está deshabilitada. Contacta al administrador.');
      return;
    }

    // Verificar que el proyecto soporta SSO
    if (project.sso_mode !== 'sso_light') {
      setSsoError('Este proyecto no utiliza acceso SSO.');
      return;
    }

    // Verificar URL de admin
    if (!project.admin_url) {
      setSsoError('Este proyecto no utiliza acceso SSO.');
      return;
    }

    // Simular estados de error forzados
    if (mockSsoState.forceNoSso) {
      setSsoError('Este proyecto no utiliza acceso SSO.');
      return;
    }

    if (mockSsoState.forceExpired) {
      setSsoError('El enlace de acceso ha expirado.');
      return;
    }

    if (mockSsoState.forceInvalid) {
      setSsoError('El enlace de acceso no es válido.');
      return;
    }

    // Iniciar loading
    setIsSsoLoading(true);
    setSsoError(null);

    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 500));

      // Crear sesión SSO
      const session = createSsoSession(project.slug, user.email);

      // Construir URL con token
      const ssoUrl = buildSsoAdminUrl(project.admin_url, session.token);

      // Abrir en nueva pestaña
      window.open(ssoUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      setSsoError('Ocurrió un error al generar el acceso.');
    } finally {
      setIsSsoLoading(false);
    }
  };

  // Handler sin SSO (fallback para proyectos sin SSO)
  const handleOpenAdminPanel = () => {
    if (project.admin_url) {
      window.open(project.admin_url, '_blank', 'noopener,noreferrer');
    }
  };

  const getActionButton = () => {
    // Proyecto coming_soon
    if (project.status === 'coming_soon') {
      return (
        <button
          disabled
          className="px-6 py-3 bg-gray-300 text-gray-500 rounded-md text-sm font-medium cursor-not-allowed"
        >
          Próximamente disponible
        </button>
      );
    }

    // Proyecto in_development
    if (project.status === 'in_development') {
      return (
        <button
          disabled
          className="px-6 py-3 bg-gray-300 text-gray-500 rounded-md text-sm font-medium cursor-not-allowed"
        >
          Próximamente disponible
        </button>
      );
    }

    // Proyecto live + sso_mode = sso_light
    if (project.status === 'live' && project.sso_mode === 'sso_light' && project.admin_url) {
      return (
        <button
          onClick={handleOpenAdminPanelWithSso}
          disabled={isSsoLoading}
          className="px-6 py-3 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSsoLoading ? (
            <>
              <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
              <span>Generando acceso...</span>
            </>
          ) : (
            'Abrir panel de administración'
          )}
        </button>
      );
    }

    // Proyecto live + sso_mode = none (no debería llegar aquí desde el hub)
    if (project.status === 'live' && project.sso_mode === 'none' && project.public_url) {
      return (
        <a
          href={project.public_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Abrir proyecto
        </a>
      );
    }

    return null;
  };

  return (
    <HubLayout>
      <div>
        <Link
          to="/hub"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          ← Volver a mis proyectos
        </Link>

        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            <ProjectStatusBadge status={project.status} />
          </div>

          {projectCopy?.long && (
            <p className="text-gray-700 mb-6">{projectCopy.long}</p>
          )}

          {project.sso_mode === 'sso_light' && (
            <div className="border-t border-gray-200 pt-6 mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Modo SSO:</p>
              <p className="text-sm text-gray-600">
                Acceso con SSO Light (autenticación simplificada)
              </p>
            </div>
          )}

          {/* Mensaje de error SSO */}
          {ssoError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{ssoError}</p>
            </div>
          )}

          <div className="flex items-center gap-4">
            {getActionButton()}
          </div>
        </div>
      </div>
    </HubLayout>
  );
}