import { useState } from 'react';

export interface UserFormData {
  email: string;
  full_name: string;
  username: string;
  hub_role: 'superadmin' | 'member';
  status: 'active' | 'disabled';
}

interface UserFormProps {
  initialData?: Partial<UserFormData>;
  onSubmit: (data: UserFormData) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

export function UserForm({ initialData, onSubmit, onCancel, isEdit = false }: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    email: initialData?.email || '',
    full_name: initialData?.full_name || '',
    username: initialData?.username || '',
    hub_role: initialData?.hub_role || 'member',
    status: initialData?.status || 'active',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UserFormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UserFormData, string>> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'El nombre es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email <span className="text-red-600">*</span>
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          disabled={isEdit}
          className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isEdit ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
          } ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="usuario@ejemplo.com"
        />
        {isEdit && (
          <p className="text-xs text-gray-500 mt-1">El email no se puede modificar después de crear el usuario</p>
        )}
        {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
      </div>

      {/* Nombre completo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre completo <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          value={formData.full_name}
          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.full_name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Juan Pérez"
        />
        {errors.full_name && <p className="text-xs text-red-600 mt-1">{errors.full_name}</p>}
      </div>

      {/* Username */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Username <span className="text-gray-500 text-xs">(opcional)</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">@</span>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="jperez"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Aparecerá como @{formData.username || 'username'} en el Hub. Si no se proporciona, se usará el nombre completo.
        </p>
      </div>

      {/* Rol */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rol en el Hub <span className="text-red-600">*</span>
        </label>
        <select
          value={formData.hub_role}
          onChange={(e) => setFormData({ ...formData, hub_role: e.target.value as 'superadmin' | 'member' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="member">Member</option>
          <option value="superadmin">Superadmin</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">
          {formData.hub_role === 'superadmin' 
            ? 'Acceso completo a todos los proyectos y configuraciones' 
            : 'Acceso solo a proyectos asignados'}
        </p>
      </div>

      {/* Estado */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Estado <span className="text-red-600">*</span>
        </label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'disabled' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="active">Activo</option>
          <option value="disabled">Deshabilitado</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Los usuarios deshabilitados no pueden iniciar sesión
        </p>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          {isEdit ? 'Guardar cambios' : 'Crear usuario'}
        </button>
      </div>
    </form>
  );
}