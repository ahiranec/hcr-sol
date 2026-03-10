import { useState, useEffect } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { homeRepo } from '@/data/repos/homeRepo';

export function HomeManagerBranding() {
  const [branding, setBranding] = useState(homeRepo.getHomeBrandingSync());
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    
    // Simular guardado
    setTimeout(() => {
      homeRepo.updateHomeBranding(branding);
      setIsSaving(false);
      alert('✅ Branding guardado correctamente');
    }, 500);
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Logo del Home</h3>
        <p className="text-sm text-gray-600 mt-1">
          Configura el logo que aparece en el sitio público
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        {/* Logo */}
        <ImageUploader
          label="Logo"
          currentImageUrl={branding.logo_url}
          onImageChange={(url) => setBranding({ ...branding, logo_url: url })}
          aspectRatio="3 / 1"
        />

        {/* Botón Guardar */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}