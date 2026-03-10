import { useNavigate } from 'react-router';
import { UserForm, type UserFormData } from '../components/UserForm';
import { profilesRepo } from '@/data/repos/profilesRepo';
import { ArrowLeft } from 'lucide-react';

export function UsersManagerCrear() {
  const navigate = useNavigate();

  const handleSubmit = (data: UserFormData) => {
    // Verificar que no exista un usuario con el mismo email
    const exists = profilesRepo.getAllUsersSync().find(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (exists) {
      alert('❌ Ya existe un usuario con ese email');
      return;
    }

    // Crear nuevo usuario
    profilesRepo.createUser({
      email: data.email,
      full_name: data.full_name,
      username: data.username.trim() || null,
      hub_role: data.hub_role,
    });

    alert('✅ Usuario creado correctamente. Se enviará un email de invitación.');
    navigate('/hub/superadmin/users-manager');
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
        
        <h3 className="text-xl font-semibold text-gray-900">Crear usuario</h3>
        <p className="text-sm text-gray-600 mt-1">
          Completa el formulario para invitar a un nuevo usuario al Hub
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <UserForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>

      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Nota:</strong> Al crear el usuario, se enviará automáticamente un email de invitación
          con instrucciones para establecer su contraseña y acceder al Hub.
        </p>
      </div>
    </div>
  );
}