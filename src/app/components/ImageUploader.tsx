import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ImageUploaderProps {
  currentImageUrl?: string | null;
  onImageChange: (url: string | null) => void;
  label?: string;
  aspectRatio?: string;
}

export function ImageUploader({ 
  currentImageUrl, 
  onImageChange, 
  label = 'Imagen',
  aspectRatio = '16 / 9' 
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        alert('❌ Por favor selecciona un archivo de imagen válido');
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('❌ La imagen no debe superar los 5MB');
        return;
      }

      // Convertir a base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onImageChange(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {currentImageUrl ? (
        <div className="relative group">
          <div 
            className="w-full rounded-lg overflow-hidden border border-gray-200"
            style={{ aspectRatio }}
          >
            <ImageWithFallback 
              src={currentImageUrl} 
              alt={label}
              className="w-full h-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm border border-gray-300 text-gray-700 rounded-md transition-colors hover:bg-white hover:border-gray-400 hover:text-gray-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={handleButtonClick}
            className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-gray-400 transition-colors"
          >
            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 font-medium">Seleccionar imagen desde equipo</p>
            <p className="text-xs text-gray-500 mt-1">JPG, PNG o WebP - Máximo 5MB</p>
          </button>
        </div>
      )}
    </div>
  );
}