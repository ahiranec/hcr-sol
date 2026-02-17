import { useState } from 'react';
import { Plus } from 'lucide-react';
import { ImageUploader } from '../components/ImageUploader';
import { OrderableList } from '../components/OrderableList';
import { getHomeHero, updateHomeHeroHeadline, addHeroImage, removeHeroImage, reorderHeroImages } from '@/data/mocks';

export function HomeManagerHero() {
  const [hero, setHero] = useState(getHomeHero());
  const [headline, setHeadline] = useState(hero.headline);
  const [isSaving, setIsSaving] = useState(false);
  const [showImageUploader, setShowImageUploader] = useState(false);

  const handleSaveHeadline = () => {
    setIsSaving(true);
    
    setTimeout(() => {
      updateHomeHeroHeadline(headline);
      setIsSaving(false);
      alert('✅ Headline guardado correctamente');
    }, 500);
  };

  const handleAddImage = (url: string | null) => {
    if (url) {
      addHeroImage(url);
      setHero(getHomeHero());
      setShowImageUploader(false);
    }
  };

  const handleRemoveImage = (imageId: string) => {
    removeHeroImage(imageId);
    setHero(getHomeHero());
  };

  const handleReorderImages = (items: any[]) => {
    const reordered = items.map((item, index) => {
      const img = hero.carousel_images.find(i => i.id === item.id)!;
      return { ...img, order: index + 1 };
    });
    reorderHeroImages(reordered);
    setHero(getHomeHero());
  };

  return (
    <div className="max-w-3xl space-y-8">
      {/* Headline */}
      <div>
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Carrusel Principal del Home</h3>
          <p className="text-sm text-gray-600 mt-1">
            Configura el texto e imágenes del carrusel principal
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Texto principal
            </label>
            <textarea
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              rows={3}
              maxLength={200}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Transformamos ideas en experiencias digitales"
            />
            <p className="text-xs text-gray-500">{headline.length}/200 caracteres</p>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              onClick={handleSaveHeadline}
              disabled={isSaving}
              className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {isSaving ? 'Guardando...' : 'Guardar texto'}
            </button>
          </div>
        </div>
      </div>

      {/* Carrusel de imágenes */}
      <div>
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Imágenes del carrusel</h3>
          <p className="text-sm text-gray-600 mt-1">
            Imágenes que se muestran en rotación en el carrusel principal
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          {!showImageUploader ? (
            <button
              onClick={() => setShowImageUploader(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Agregar imagen
            </button>
          ) : (
            <div className="space-y-3">
              <ImageUploader
                currentImageUrl={null}
                onImageChange={handleAddImage}
                label="Nueva imagen para carrusel"
                aspectRatio="21 / 9"
              />
              <button
                onClick={() => setShowImageUploader(false)}
                className="text-sm text-gray-600 hover:text-gray-700"
              >
                Cancelar
              </button>
            </div>
          )}

          {hero.carousel_images.length > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Imágenes actuales ({hero.carousel_images.length})
              </p>
              <OrderableList
                items={hero.carousel_images.map(img => ({
                  id: img.id,
                  label: `Imagen ${img.order}`,
                  imageUrl: img.image_url,
                }))}
                onReorder={handleReorderImages}
                onRemove={handleRemoveImage}
                showImages
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}