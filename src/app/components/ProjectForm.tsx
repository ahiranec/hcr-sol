import { useState } from 'react';
import { ImageUploader } from './ImageUploader';

export interface ProjectFormData {
  slug: string;
  name: string;
  status: 'in_development' | 'live';
  publicUrl: string | null;
  adminUrl: string | null;
  description: string;
  version: string;
  imageUrl: string;
  ssoEnabled: boolean;
  ssoUrl: string | null;
  showInHome: boolean;
}

interface ProjectFormProps {
  initialData?: Partial<ProjectFormData>;
  onSubmit: (data: ProjectFormData) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

export function ProjectForm({ initialData, onSubmit, onCancel, isEdit = false }: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    slug: initialData?.slug || '',
    name: initialData?.name || '',
    status: initialData?.status || 'in_development',
    publicUrl: initialData?.publicUrl || null,
    adminUrl: initialData?.adminUrl || null,
    description: initialData?.description || '',
    version: initialData?.version || '',
    imageUrl: initialData?.imageUrl || '',
    ssoEnabled: initialData?.ssoEnabled || false,
    ssoUrl: initialData?.ssoUrl || null,
    showInHome: initialData?.showInHome || false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProjectFormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProjectFormData, string>> = {};

    if (!formData.slug.trim()) {
      newErrors.slug = 'El slug es obligatorio';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'El slug solo puede contener letras minúsculas, números y guiones';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    }

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'La imagen es obligatoria';
    }

    if (formData.ssoEnabled && !formData.ssoUrl?.trim()) {
      newErrors.ssoUrl = 'La URL SSO es obligatoria si el SSO está habilitado';
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
      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Slug <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase() })}
          disabled={isEdit}
          className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isEdit ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
          } ${errors.slug ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="mi-proyecto"
        />
        {isEdit && (
          <p className="text-xs text-gray-500 mt-1">El slug no se puede modificar después de crear el proyecto</p>
        )}
        {errors.slug && <p className="text-xs text-red-600 mt-1">{errors.slug}</p>}
      </div>

      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre del proyecto <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Mi Proyecto"
        />
        {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
      </div>

      {/* Estado */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Estado <span className="text-red-600">*</span>
        </label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as 'in_development' | 'live' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="in_development">En desarrollo</option>
          <option value="live">Disponible</option>
        </select>
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descripción <span className="text-red-600">*</span>
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          maxLength={200}
          className={`w-full px-3 py-2 border rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Describe brevemente el proyecto..."
        />
        <p className="text-xs text-gray-500 mt-1">{formData.description.length}/200 caracteres</p>
        {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
      </div>

      {/* Versión */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Versión
        </label>
        <input
          type="text"
          value={formData.version}
          onChange={(e) => setFormData({ ...formData, version: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="v1.0"
        />
      </div>

      {/* Imagen */}
      <div>
        <ImageUploader
          label="Imagen del proyecto *"
          currentImageUrl={formData.imageUrl}
          onImageChange={(url) => setFormData({ ...formData, imageUrl: url || '' })}
          aspectRatio="16 / 9"
        />
        {errors.imageUrl && <p className="text-xs text-red-600 mt-1">{errors.imageUrl}</p>}
      </div>

      {/* URL del Sitio Web */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          URL del sitio web
        </label>
        <input
          type="url"
          value={formData.publicUrl || ''}
          onChange={(e) => setFormData({ ...formData, publicUrl: e.target.value || null })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://mi-proyecto.com"
        />
        <p className="text-xs text-gray-500 mt-1">
          URL del sitio web público del proyecto (opcional)
        </p>
      </div>

      {/* URL del Panel de Administración */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          URL del panel de administración
        </label>
        <input
          type="url"
          value={formData.adminUrl || ''}
          onChange={(e) => setFormData({ ...formData, adminUrl: e.target.value || null })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://admin.mi-proyecto.com"
        />
        <p className="text-xs text-gray-500 mt-1">
          URL del backoffice o panel de administración del proyecto (opcional)
        </p>
      </div>

      {/* SSO Habilitado */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.ssoEnabled}
            onChange={(e) => setFormData({ ...formData, ssoEnabled: e.target.checked })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Habilitar SSO</span>
        </label>
        <p className="text-xs text-gray-500 mt-1 ml-6">
          Permite acceso directo mediante Single Sign-On
        </p>
      </div>

      {/* URL SSO (solo si ssoEnabled) */}
      {formData.ssoEnabled && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL SSO <span className="text-red-600">*</span>
          </label>
          <input
            type="url"
            value={formData.ssoUrl || ''}
            onChange={(e) => setFormData({ ...formData, ssoUrl: e.target.value || null })}
            className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.ssoUrl ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="https://proyecto.ejemplo.com/sso/auth"
          />
          {errors.ssoUrl && <p className="text-xs text-red-600 mt-1">{errors.ssoUrl}</p>}
        </div>
      )}

      {/* Mostrar en Home */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.showInHome}
            onChange={(e) => setFormData({ ...formData, showInHome: e.target.checked })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Mostrar en Home</span>
        </label>
        <p className="text-xs text-gray-500 mt-1 ml-6">
          Muestra el proyecto en la página principal
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
          {isEdit ? 'Guardar cambios' : 'Crear proyecto'}
        </button>
      </div>
    </form>
  );
}