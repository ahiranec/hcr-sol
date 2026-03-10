import { useNavigate, useParams } from 'react-router';
import { UserForm, type UserFormData } from '../components/UserForm';
import { profilesRepo } from '@/data/repos/profilesRepo';
import { ArrowLeft } from 'lucide-react';

export function UsersManagerEditar() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Buscar el usuario
  const user = profilesRepo.getUserByIdSync(id!);

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

  const handleSubmit = (data: UserFormData) => {
    // No permitir cambiar el rol del superadmin principal
    if (user.email === 'ahirane@gmail.com' && data.hub_role !== 'superadmin') {
      alert('❌ No puedes cambiar el rol del superadmin principal');
      return;
    }

    // No permitir deshabilitar al superadmin principal
    if (user.email === 'ahirane@gmail.com' && data.status === 'disabled') {
      alert('❌ No puedes deshabilitar al superadmin principal');
      return;
    }

    // Actualizar el usuario
    const success = profilesRepo.updateUser(id!, {
      full_name: data.full_name,
      hub_role: data.hub_role,
      status: data.status,
    });

    if (success) {
      alert('✅ Usuario actualizado correctamente');
      navigate('/hub/superadmin/users-manager');
    } else {
      alert('❌ Error al actualizar el usuario');
    }
  };

  const handleCancel = () => {
    navigate('/hub/superadmin/users-manager');
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <button
          onClick={() => navigate('/hub/superadmin/users-manager')}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Volver al listado</span>
        </button>
        
        <h3 className="text-xl font-semibold text-gray-900">Editar usuario</h3>
        <p className="text-sm text-gray-600 mt-1">
          Modifica los datos del usuario "{user.full_name}"
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <UserForm
          initialData={user}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isEdit
        />
      </div>
    </div>
  );
}