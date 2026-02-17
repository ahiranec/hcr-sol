import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { getUserById, getUserProjectAccesses, updateUserProjectAccess, mockProjects } from '@/data/mocks';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Eye, Shield, Check, ArrowLeft } from 'lucide-react';

export function UsersManagerAccesos() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const user = getUserById(id!);
  const [userAccesses, setUserAccesses] = useState(getUserProjectAccesses(id!));

  if (!user) {
    return (
      <div className="max-w-3xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-2">Usuario no encontrado</h3>
          <p className="text-sm text-red-700 mb-4">
            El usuario con ID "{id}" no existe en el sistema.
          </p>
          <button
            onClick={() => navigate('/hub/superadmin/users-manager')}
            className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Volver al listado
          </button>
        </div>
      </div>
    );
  }

  // Si es superadmin, mostrar mensaje informativo
  if (user.hub_role === 'superadmin') {
    return (
      <div className="max-w-4xl">
        <div className="mb-6">
          <button
            onClick={() => navigate('/hub/superadmin/users-manager')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Volver al listado</span>
          </button>
          
          <h3 className="text-xl font-semibold text-gray-900">Gestionar accesos</h3>
          <p className="text-sm text-gray-600 mt-1">
            {user.full_name} · {user.email}
          </p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-purple-900 mb-1">
                Usuario con rol Superadmin
              </h4>
              <p className="text-sm text-purple-800">
                Los usuarios con rol <strong>Superadmin</strong> tienen acceso automático a todos los proyectos
                del Hub, incluyendo permisos de visualización y administración. No es necesario asignar
                accesos individuales.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/hub/superadmin/users-manager')}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700 transition-colors"
          >
            Volver al listado
          </button>
        </div>
      </div>
    );
  }

  const hasAccess = (projectSlug: string) => {
    return userAccesses.find(a => a.project_slug === projectSlug);
  };

  const toggleAccess = (projectSlug: string, type: 'view' | 'admin') => {
    const current = hasAccess(projectSlug);

    if (type === 'view') {
      // Toggle view access
      if (current?.can_view) {
        // Desactivar todo
        updateUserProjectAccess(id!, projectSlug, { can_view: false, can_admin: false });
      } else {
        // Activar solo view
        updateUserProjectAccess(id!, projectSlug, { can_view: true, can_admin: false });
      }
    } else {
      // Toggle admin access (requiere can_view)
      if (current?.can_admin) {
        // Desactivar admin, mantener view
        updateUserProjectAccess(id!, projectSlug, { can_view: true, can_admin: false });
      } else {
        // Activar admin (y view automáticamente)
        updateUserProjectAccess(id!, projectSlug, { can_view: true, can_admin: true });
      }
    }

    // Actualizar estado local
    setUserAccesses(getUserProjectAccesses(id!));
  };

  const handleSave = () => {
    alert('✅ Accesos actualizados correctamente');
    navigate('/hub/superadmin/users-manager');
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <button
          onClick={() => navigate('/hub/superadmin/users-manager')}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Volver al listado</span>
        </button>
        
        <h3 className="text-xl font-semibold text-gray-900">Gestionar accesos a proyectos</h3>
        <p className="text-sm text-gray-600 mt-1">
          {user.full_name} · {user.email}
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          <strong>Permisos:</strong> <strong>Ver</strong> permite acceder al proyecto desde el Hub.{' '}
          <strong>Admin</strong> permite acceder al panel de administración (requiere Ver).
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Proyecto
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ver
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Admin
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockProjects.map((project) => {
              const access = hasAccess(project.slug);
              return (
                <tr key={project.slug} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                        <ImageWithFallback
                          src={project.image_url || ''}
                          alt={project.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{project.name}</p>
                        <p className="text-xs text-gray-500">{project.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => toggleAccess(project.slug, 'view')}
                      className={`inline-flex items-center justify-center w-10 h-10 rounded-md transition-colors ${
                        access?.can_view
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                      title={access?.can_view ? 'Revocar acceso' : 'Conceder acceso'}
                    >
                      {access?.can_view ? <Check className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => toggleAccess(project.slug, 'admin')}
                      disabled={!access?.can_view}
                      className={`inline-flex items-center justify-center w-10 h-10 rounded-md transition-colors ${
                        access?.can_admin
                          ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          : access?.can_view
                          ? 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                      }`}
                      title={
                        !access?.can_view
                          ? 'Requiere acceso de visualización'
                          : access?.can_admin
                          ? 'Revocar acceso admin'
                          : 'Conceder acceso admin'
                      }
                    >
                      {access?.can_admin ? <Check className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => navigate('/hub/superadmin/users-manager')}
          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
}