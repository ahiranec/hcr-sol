import { Link, useParams, useNavigate } from 'react-router';
import { Badge } from '../components/Badge';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { MainLayout } from '../components/MainLayout';
import { projectsRepo } from '@/data/repos/projectsRepo';
import { authRepo } from '@/data/repos/authRepo';
import hcrSolLogo from '@/assets/4cc5722396a543fc4af4b21d4f57e4ae31cf2825.png';

export function PublicProjectDetail() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const user = authRepo.getCurrentUserSync();

  const handleLogout = () => {
    authRepo.logout();
    navigate('/');
  };

  // Estados simulados
  if (authRepo.getUiState().loading) {
    return (
      <div className="min-h-screen bg-white">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="text-xl font-semibold">HCR Sol</div>
            <Link
              to="/login"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Ingresar
            </Link>
          </div>
        </header>
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
            <p className="text-gray-600">Cargando...</p>
          </div>
        </div>
      </div>
    );
  }

  if (authRepo.getUiState().error) {
    return (
      <div className="min-h-screen bg-white">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="text-xl font-semibold">HCR Sol</div>
            <Link
              to="/login"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Ingresar
            </Link>
          </div>
        </header>
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
      </div>
    );
  }

  const project = projectsRepo.getPublicProjectsSync().find(p => p.slug === slug);

  if (!project) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Proyecto no encontrado</h1>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const copy = projectsRepo.getProjectCopySync()[project.slug];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <img src={hcrSolLogo} alt="HCR Sol" className="h-16 w-auto object-contain" />
          </Link>
          {user ? (
            <div className="flex items-center gap-4">
              <Link
                to="/hub"
                className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                {user.full_name}
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Ingresar
            </Link>
          )}
        </div>
      </header>

      {/* Contenido con MainLayout */}
      <MainLayout>
        <div className="py-12">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-8"
          >
            ← Volver
          </Link>

          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
              <Badge variant={project.status === 'live' ? 'live' : project.status === 'coming_soon' ? 'coming_soon' : 'development'}>
                {project.status === 'live' ? 'Activo' : project.status === 'coming_soon' ? 'Próximamente' : 'En desarrollo'}
              </Badge>
            </div>

            <p className="text-lg text-gray-700 mb-8">
              {copy?.long || ''}
            </p>

            {project.status === 'live' && project.publicUrl ? (
              <a
                href={project.publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Ir al sitio
              </a>
            ) : (
              <button
                disabled
                className="inline-flex items-center justify-center px-6 py-3 bg-gray-300 text-gray-500 rounded-md text-sm font-medium cursor-not-allowed"
              >
                Próximamente disponible
              </button>
            )}

            {/* Imagen del proyecto */}
            <div className="mt-8 aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <ImageWithFallback
                src={project.imageUrl}
                alt={project.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </MainLayout>

      {/* Footer */}
      <footer className="bg-gray-50 py-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-600">
          <p>HCR Sol © 2026</p>
        </div>
      </footer>
    </div>
  );
}