import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { getCurrentUser, getAllUsers, mockUiState } from '@/data/mocks';

export function Users() {
  const [isLoading, setIsLoading] = useState(true);
  const user = getCurrentUser();

  // Simular carga
  useEffect(() => {
    if (mockUiState.loading) {
      return; // Dejar en loading indefinidamente si mockUiState.loading = true
    }
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  if (!user || user.hub_role !== 'superadmin') {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No tienes permisos para acceder a esta página</p>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Error state (si mockUiState.error = true)
  if (mockUiState.error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error al cargar los usuarios</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 text-blue-600 hover:text-blue-700 underline"
        >
          Reintentar
        </button>
      </div>
    );
  }

  // Lista de usuarios (superadmin only) - ACTUALIZADO para usar getAllUsers()
  const users = getAllUsers();

  // Estado empty
  if (users.length === 0) {
    return (
      <div className="max-w-6xl">
        <div className="mb-6">
          <Link
            to="/hub"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            ← Volver a mis proyectos
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Usuarios</h1>
        
        <div className="flex items-center justify-center py-24">
          <p className="text-gray-600">No hay usuarios para mostrar.</p>
        </div>
      </div>
    );
  }

  // Mapeo de valores para display
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'superadmin': return 'Superadministrador';
      case 'admin': return 'Administrador';
      case 'member': return 'Miembro';
      case 'disabled': return 'Deshabilitado';
      default: return role;
    }
  };

  const getStatusLabel = (status: string) => {
    return status === 'active' ? 'Activo' : 'Deshabilitado';
  };

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/hub"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          ← Volver a mis proyectos
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Usuarios</h1>
      
      {/* Tabla desktop */}
      <div className="hidden md:block bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre completo
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((profile) => (
              <tr key={profile.email}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {profile.full_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {profile.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {getRoleLabel(profile.hub_role)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(profile.status)}`}>
                    {getStatusLabel(profile.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Lista mobile */}
      <div className="md:hidden space-y-4">
        {users.map((profile) => (
          <div key={profile.email} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="mb-3">
              <p className="text-sm font-medium text-gray-900">{profile.full_name}</p>
              <p className="text-sm text-gray-600 mt-1">{profile.email}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{getRoleLabel(profile.hub_role)}</span>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(profile.status)}`}>
                {getStatusLabel(profile.status)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}