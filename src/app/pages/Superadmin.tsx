import { Link } from 'react-router';
import { Home, FolderKanban, Users, ChevronRight } from 'lucide-react';

export function Superadmin() {
  const sections = [
    {
      to: '/hub/superadmin/home-manager',
      icon: Home,
      title: 'Home Manager',
      description: 'Gestiona el contenido del sitio público (branding, hero, carruseles y detalles)',
      available: true,
    },
    {
      to: '/hub/superadmin/hub-project-manager',
      icon: FolderKanban,
      title: 'Hub Project Manager',
      description: 'Crea, edita y administra proyectos del Hub',
      available: true,
    },
    {
      to: '/hub/superadmin/users-manager',
      icon: Users,
      title: 'Users & Access Manager',
      description: 'Gestiona usuarios, roles y permisos de acceso a proyectos',
      available: true,
    },
  ];

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Superadmin</h2>
        <p className="text-sm text-gray-600 mt-1">
          Panel de administración avanzada de la plataforma
        </p>
      </div>

      <div className="grid gap-4">
        {sections.map((section) => {
          const Icon = section.icon;
          
          if (section.available) {
            return (
              <Link
                key={section.to}
                to={section.to}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {section.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {section.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 group-hover:text-blue-600 transition-colors" />
                </div>
              </Link>
            );
          }

          return (
            <div
              key={section.to}
              className="bg-gray-50 border border-gray-200 rounded-lg p-6 opacity-60"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <Icon className="w-6 h-6 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-700 mb-1">
                    {section.title}
                    <span className="ml-2 text-xs font-normal text-gray-500">(Próximamente)</span>
                  </h3>
                  <p className="text-sm text-gray-500">
                    {section.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}