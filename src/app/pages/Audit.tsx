import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { getCurrentUser, mockAuditLog, mockUiState } from '@/data/mocks';

export function Audit() {
  const [isLoading, setIsLoading] = useState(true);
  const user = getCurrentUser();

  // Simular carga
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Estado de carga
  if (isLoading || mockUiState.loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Estado de error genérico
  if (mockUiState.error) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center max-w-md px-4">
          <p className="text-red-600 mb-4">Ocurrió un error al cargar la auditoría.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Usuario disabled
  if (user.status === 'disabled') {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center max-w-md px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso denegado</h1>
          <p className="text-gray-600 mb-6">Tu cuenta está deshabilitada. Contacta al administrador.</p>
          <Link
            to="/hub"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Volver a mis proyectos
          </Link>
        </div>
      </div>
    );
  }

  // Acceso denegado para member (protección redundante)
  if (user.hub_role !== 'superadmin' && user.hub_role !== 'admin') {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center max-w-md px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso denegado</h1>
          <p className="text-gray-600 mb-6">No tienes permisos para acceder a esta sección.</p>
          <Link
            to="/hub"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Volver a mis proyectos
          </Link>
        </div>
      </div>
    );
  }

  // Lista de eventos (superadmin only)
  const events = mockAuditLog || [];

  // Estado empty
  if (events.length === 0) {
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
        
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Auditoría</h1>
        
        <div className="flex items-center justify-center py-24">
          <p className="text-gray-600">No hay eventos de auditoría para mostrar.</p>
        </div>
      </div>
    );
  }

  // Formatear fecha en español
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Ordenar eventos por fecha (más reciente primero)
  const sortedEvents = [...events].sort((a, b) => b.at - a.at);

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
      
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Auditoría</h1>
      
      {/* Tabla desktop */}
      <div className="hidden md:block bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actor
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acción
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Entidad
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Identificador
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedEvents.map((event, index) => (
              <tr key={`${event.at}-${index}`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(event.at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {event.actor_email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {event.action}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {event.entity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {event.entity_ref}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Lista mobile */}
      <div className="md:hidden space-y-4">
        {sortedEvents.map((event, index) => (
          <div key={`${event.at}-${index}`} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="mb-2">
              <p className="text-xs text-gray-500">{formatDate(event.at)}</p>
            </div>
            <div className="mb-2">
              <p className="text-sm font-medium text-gray-900">{event.action}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-600">
                <span className="font-medium">Actor:</span> {event.actor_email}
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-medium">Entidad:</span> {event.entity}
              </p>
              <p className="text-xs text-gray-600">
                <span className="font-medium">Identificador:</span> {event.entity_ref}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}