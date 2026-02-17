import { Link } from 'react-router';
import { ExternalLink } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ProjectStatusBadge } from './ProjectStatusBadge';

interface ProjectCardProps {
  slug: string;
  name: string;
  status: 'live' | 'in_development' | 'coming_soon';
  publicUrl: string | null;
  description: string;
  version: string;
  lastUpdated: string;
  imageUrl: string;
}

export function ProjectCard({
  slug,
  name,
  status,
  publicUrl,
  description,
  imageUrl,
}: ProjectCardProps) {
  return (
    <Link
      to={`/proyectos/${slug}`}
      className="block bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-blue-400 hover:shadow-lg transition-all duration-200"
    >
      {/* IMAGEN SUPERIOR con badge de estado */}
      <div className="relative h-48 md:h-64 overflow-hidden bg-gray-100">
        <ImageWithFallback
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
        
        {/* Badge de estado en esquina superior derecha */}
        <div className="absolute top-3 right-3">
          <ProjectStatusBadge status={status} />
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="p-5">
        {/* Título del proyecto */}
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          {name}
        </h3>
        
        {/* Descripción */}
        <p className="text-sm text-gray-600 mb-6 line-clamp-2 min-h-[2.5rem]">
          {description}
        </p>
        
        {/* Botón de acción */}
        {status === 'live' && publicUrl ? (
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
            <ExternalLink className="w-4 h-4" />
            Abrir Web
          </button>
        ) : (
          <button disabled className="w-full px-4 py-2.5 bg-gray-100 text-gray-500 rounded-md text-sm font-medium cursor-not-allowed">
            Pronto
          </button>
        )}
      </div>
    </Link>
  );
}