import { useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import { ChevronDown, ChevronRight, FolderKanban, User, Home as HomeIcon, UserCircle } from 'lucide-react';
import { canAccessSuperadminTab, type MockProfile } from '@/data/mocks';

interface HubTabsProps {
  user: MockProfile;
}

export function HubTabs({ user }: HubTabsProps) {
  const location = useLocation();
  const showSuperadminTab = canAccessSuperadminTab(user);
  const [isSuperadminExpanded, setIsSuperadminExpanded] = useState(true);

  // Subsecciones de Superadmin
  const superadminSubsections = [
    {
      label: 'Home Manager',
      path: '/hub/superadmin/home-manager',
      icon: HomeIcon,
    },
    {
      label: 'Hub Manager',
      path: '/hub/superadmin/hub-project-manager',
      icon: FolderKanban,
    },
    {
      label: 'User & Access',
      path: '/hub/superadmin/users-manager',
      icon: User,
    },
  ];

  const toggleSuperadmin = () => {
    setIsSuperadminExpanded(!isSuperadminExpanded);
  };

  const isSuperadminActive = location.pathname.includes('/hub/superadmin');

  return (
    <>
      {/* Mobile: Tabs horizontales arriba */}
      <div className="lg:hidden flex gap-8 overflow-x-auto py-4">
        <NavLink
          to="/hub"
          end
          className={({ isActive }) =>
            `py-2 px-1 border-b-2 text-sm font-medium whitespace-nowrap transition-colors ${
              isActive
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
            }`
          }
        >
          Proyectos
        </NavLink>

        {showSuperadminTab && (
          <NavLink
            to="/hub/superadmin"
            className={({ isActive }) =>
              `py-2 px-1 border-b-2 text-sm font-medium whitespace-nowrap transition-colors ${
                isActive || isSuperadminActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`
            }
          >
            Superadmin
          </NavLink>
        )}

        <NavLink
          to="/hub/perfil"
          className={({ isActive }) =>
            `py-2 px-1 border-b-2 text-sm font-medium whitespace-nowrap transition-colors ${
              isActive
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
            }`
          }
        >
          Perfil
        </NavLink>
      </div>

      {/* Desktop: Sidebar vertical a la izquierda */}
      <div className="hidden lg:flex lg:flex-col lg:gap-1 lg:py-6">
        {/* Proyectos */}
        <NavLink
          to="/hub"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`
          }
        >
          <FolderKanban className="w-5 h-5" />
          Proyectos
        </NavLink>

        {/* Superadmin - Expandible */}
        {showSuperadminTab && (
          <div>
            <button
              onClick={toggleSuperadmin}
              className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isSuperadminActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <User className="w-5 h-5" />
                Superadmin
              </div>
              {isSuperadminExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>

            {/* Subsecciones de Superadmin */}
            {isSuperadminExpanded && (
              <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-4">
                {superadminSubsections.map((subsection) => {
                  const Icon = subsection.icon;
                  return (
                    <NavLink
                      key={subsection.path}
                      to={subsection.path}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                          isActive
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4" />
                      {subsection.label}
                    </NavLink>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Perfil */}
        <NavLink
          to="/hub/perfil"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`
          }
        >
          <UserCircle className="w-5 h-5" />
          Perfil
        </NavLink>
      </div>
    </>
  );
}