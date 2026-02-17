import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router';
import { MoreVertical, ExternalLink, Pencil, Trash2 } from 'lucide-react';

interface ProjectActionsMenuProps {
  slug: string;
  publicUrl?: string | null;
  onDelete: (slug: string) => void;
  compact?: boolean; // Para usar en mobile
}

export function ProjectActionsMenu({ slug, publicUrl, onDelete, compact = false }: ProjectActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  if (compact) {
    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Acciones"
        >
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
            {publicUrl && (
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-gray-400" />
                Abrir proyecto
              </a>
            )}
            <Link
              to={`/hub/superadmin/hub-project-manager/editar/${slug}`}
              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Pencil className="w-4 h-4 text-gray-400" />
              Editar
            </Link>
            <button
              onClick={() => {
                setIsOpen(false);
                onDelete(slug);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar
            </button>
          </div>
        )}
      </div>
    );
  }

  // Vista desktop (botones inline)
  return (
    <div className="flex items-center justify-end gap-2">
      {publicUrl && (
        <a
          href={publicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
          title="Abrir proyecto"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      )}
      <Link
        to={`/hub/superadmin/hub-project-manager/editar/${slug}`}
        className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
        title="Editar"
      >
        <Pencil className="w-4 h-4" />
      </Link>
      <button
        onClick={() => onDelete(slug)}
        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
        title="Eliminar"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
