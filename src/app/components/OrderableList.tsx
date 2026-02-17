import { useState } from 'react';
import { GripVertical, X } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface OrderableItem {
  id: string;
  label: string;
  imageUrl?: string;
}

interface OrderableListProps {
  items: OrderableItem[];
  onReorder: (items: OrderableItem[]) => void;
  onRemove?: (itemId: string) => void;
  showImages?: boolean;
}

export function OrderableList({ 
  items, 
  onReorder, 
  onRemove,
  showImages = false 
}: OrderableListProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === index) return;

    const newItems = [...items];
    const draggedItem = newItems[draggedIndex];
    
    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);
    
    setDraggedIndex(index);
    onReorder(newItems);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleRemove = (itemId: string) => {
    if (onRemove) {
      onRemove(itemId);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
        No hay elementos
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div
          key={item.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          className={`flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-move hover:border-gray-300 transition-all ${
            draggedIndex === index ? 'opacity-50' : ''
          }`}
        >
          <GripVertical className="w-5 h-5 text-gray-400 flex-shrink-0" />
          
          {showImages && item.imageUrl && (
            <div className="w-16 h-16 rounded overflow-hidden bg-gray-100 flex-shrink-0">
              <ImageWithFallback 
                src={item.imageUrl} 
                alt={item.label}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <span className="text-sm text-gray-900 flex-1">{item.label}</span>
          
          <span className="text-xs text-gray-500 flex-shrink-0">#{index + 1}</span>
          
          {onRemove && (
            <button
              type="button"
              onClick={() => handleRemove(item.id)}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
