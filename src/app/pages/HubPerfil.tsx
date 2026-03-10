import { useState } from 'react';
import { createPortal } from 'react-dom';
import { authRepo } from '@/data/repos/authRepo';
import { profilesRepo } from '@/data/repos/profilesRepo';
import { toast } from 'sonner';

export function HubPerfil() {
  const user = authRepo.getCurrentUserSync();
  const [username, setUsername] = useState(user?.username ?? '');
  const [fullName, setFullName] = useState(user?.full_name ?? '');
  const [isEditing, setIsEditing] = useState(false);
  
  // Estados para modal de contraseña
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!user) return null;

  const handleSave = () => {
    if (!user.id) return;

    const success = profilesRepo.updateUserProfile(user.id, {
      username: username.trim() || null,
      full_name: fullName.trim(),
    });

    if (success) {
      toast.success('Perfil actualizado correctamente');
      setIsEditing(false);
    } else {
      toast.error('El username ya está en uso');
    }
  };

  const handleCancel = () => {
    setUsername(user.username ?? '');
    setFullName(user.full_name ?? '');
    setIsEditing(false);
  };

  const handlePasswordChange = () => {
    // Validaciones
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Todos los campos son obligatorios');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas nuevas no coinciden');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // Simulación de cambio de contraseña exitoso
    toast.success('Contraseña actualizada correctamente');
    setShowPasswordModal(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handlePasswordModalClose = () => {
    setShowPasswordModal(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Perfil</h1>
      
      {/* Información */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Información</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Editar
            </button>
          )}
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username {!isEditing && !user.username && <span className="text-gray-500">(opcional)</span>}
            </label>
            <div className="relative">
              {isEditing && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">@</span>
              )}
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                readOnly={!isEditing}
                placeholder="ahirane"
                className={`w-full ${isEditing ? 'pl-7' : ''} px-3 py-2 border border-gray-300 rounded-md ${
                  isEditing ? 'bg-white' : 'bg-gray-50 text-gray-600'
                }`}
              />
            </div>
            {isEditing && (
              <p className="text-xs text-gray-500 mt-1">
                Aparecerá como @{username || 'tu-username'} en el Hub
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre completo
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              readOnly={!isEditing}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                isEditing ? 'bg-white' : 'bg-gray-50 text-gray-600'
              }`}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={user.email}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
            />
            <p className="text-xs text-gray-500 mt-1">El email no se puede modificar</p>
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={!fullName.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Guardar cambios
            </button>
          </div>
        )}
      </div>

      {/* Seguridad */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Seguridad</h2>
        
        <button
          onClick={() => setShowPasswordModal(true)}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Cambiar contraseña
        </button>
      </div>

      {/* Modal de cambio de contraseña */}
      {showPasswordModal && createPortal(
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50"
          onClick={handlePasswordModalClose}
        >
          <div 
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Cambiar contraseña</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña actual
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nueva contraseña
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                />
                <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar nueva contraseña
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={handlePasswordModalClose}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handlePasswordChange}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Cambiar contraseña
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}