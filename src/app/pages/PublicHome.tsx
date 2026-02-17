import { Link, useNavigate } from 'react-router';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { MainLayout } from '../components/MainLayout';
import { ProjectCard } from '../components/ProjectCard';
import { mockProjects, mockUiState, getCurrentUser, mockLogout } from '@/data/mocks';
import hcrSolLogo from '@/assets/4cc5722396a543fc4af4b21d4f57e4ae31cf2825.png';

export function PublicHome() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const developmentProjects = mockProjects.filter(p => p.show_in_home && p.status === 'in_development');
  const liveProjects = mockProjects.filter(p => p.show_in_home && p.status === 'live');

  const handleLogout = () => {
    mockLogout();
    navigate('/');
  };

  // Configuración del carrusel hero
  const heroSliderSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    fade: true,
    arrows: false,
  };

  // Estados simulados
  if (mockUiState.loading) {
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

  if (mockUiState.error) {
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
            <p className="text-red-600 mb-4">Ocurrió un error al cargar los proyectos.</p>
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Full width fuera del MainLayout */}
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

      {/* Contenido con MainLayout (3 columnas responsivo) */}
      <MainLayout>
        {/* Hero Carousel - Ahora dentro del contenido principal */}
        <section className="hero-carousel carousel-fullwidth mt-0 mb-12 md:mb-16">
          <Slider {...heroSliderSettings}>
            {/* Slide 1: HCR Sol - Soluciones integrales tecnológicas */}
            <div className="relative h-[400px] md:h-[500px]">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1755029553373-87246d245ec1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5yaXNlJTIwdGVjaG5vbG9neSUyMGdyYWRpZW50JTIwb3JhbmdlfGVufDF8fHx8MTc3MTExNjM3MHww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="HCR Sol - Soluciones Tecnológicas"
                className="w-full h-full object-cover brightness-75"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-4">
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                    HCR Sol
                  </h1>
                  <p className="text-xl md:text-2xl text-white drop-shadow-md">
                    Soluciones Integrales Tecnológicas
                  </p>
                </div>
              </div>
            </div>

            {/* Slide 2: Frase creativa */}
            <div className="relative h-[400px] md:h-[500px]">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1760629863094-5b1e8d1aae74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwdHJhbnNmb3JtYXRpb24lMjBpbm5vdmF0aW9uJTIwZnV0dXJlfGVufDF8fHx8MTc3MTExNjM2N3ww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Transformación Digital"
                className="w-full h-full object-cover brightness-[0.65]"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-4 max-w-4xl">
                  <p className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg leading-tight">
                    Transformando ideas en realidad digital
                  </p>
                </div>
              </div>
            </div>
          </Slider>
        </section>

        {/* Proyectos en Desarrollo */}
        {developmentProjects.length > 0 && (
          <section className="mb-12 md:mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Proyectos en Desarrollo</h2>

            {/* Grid responsive */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {developmentProjects.map((project) => (
                <ProjectCard
                  key={project.slug}
                  slug={project.slug}
                  name={project.name}
                  status={project.status}
                  publicUrl={project.public_url}
                  description={project.description || ''}
                  version={project.version || '-'}
                  lastUpdated={project.last_update_label || '-'}
                  imageUrl={project.image_url || ''}
                />
              ))}
            </div>
          </section>
        )}

        {/* Proyectos Disponibles */}
        {liveProjects.length > 0 && (
          <section className="pb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Proyectos Disponibles</h2>

            {/* Grid responsive */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveProjects.map((project) => (
                <ProjectCard
                  key={project.slug}
                  slug={project.slug}
                  name={project.name}
                  status={project.status}
                  publicUrl={project.public_url}
                  description={project.description || ''}
                  version={project.version || '-'}
                  lastUpdated={project.last_update_label || '-'}
                  imageUrl={project.image_url || ''}
                />
              ))}
            </div>
          </section>
        )}
      </MainLayout>

      {/* Footer - Full width */}
      <footer className="bg-gray-50 py-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-600">
          <p>HCR Sol © 2026</p>
        </div>
      </footer>
    </div>
  );
}