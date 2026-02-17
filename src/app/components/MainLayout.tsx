import { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
  showSidebars?: boolean;
  className?: string;
}

/**
 * MainLayout - Sistema de 3 columnas responsivo profesional
 * 
 * Breakpoints:
 * - Mobile S (320-480px): 100% width, padding 16px
 * - Mobile L (481-767px): 100% width, padding 24px
 * - Tablet (768-1023px): Max 720px centrado
 * - Desktop S (1024-1199px): Max 900px centrado
 * - Desktop M (1200-1439px): [160px sidebar] [max-1024px content] [160px sidebar]
 * - Desktop L (1440-1919px): [200px sidebar] [max-1200px content] [200px sidebar]
 * - Desktop XL (≥1920px): [280px sidebar] [1200px fixed content] [280px sidebar]
 */
export function MainLayout({ children, showSidebars = true, className = '' }: MainLayoutProps) {
  return (
    <div className={`responsive-layout ${className}`}>
      {/* Sidebars solo visibles en desktop ≥1200px */}
      {showSidebars && (
        <>
          {/* Left Sidebar - Vacía, lista para contenido futuro */}
          <aside className="sidebar-left bg-gray-50 border-r border-gray-200">
            {/* Sin contenido por ahora - agregar widgets según necesidad */}
          </aside>

          {/* Right Sidebar - Vacía, lista para contenido futuro */}
          <aside className="sidebar-right bg-gray-50 border-l border-gray-200">
            {/* Sin contenido por ahora - agregar widgets según necesidad */}
          </aside>
        </>
      )}

      {/* Main Content - Siempre centrado y responsivo */}
      <main className="main-content">
        {children}
      </main>

      {/* Estilos CSS inline para el sistema de grid */}
      <style>{`
        /* Layout Grid de 3 columnas */
        .responsive-layout {
          display: grid;
          min-height: 100vh;
          background: white;
        }

        /* Ocultar sidebars por defecto */
        .sidebar-left,
        .sidebar-right {
          display: none;
        }

        /* Mobile S & L (320px - 767px): Solo contenido, sin sidebars */
        @media (max-width: 767px) {
          .responsive-layout {
            grid-template-columns: 1fr;
            grid-template-areas: "content";
          }
          
          .main-content {
            grid-area: content;
            padding: 0 16px 16px 16px;
            max-width: 100%;
            margin: 0 auto;
            overflow-x: hidden; /* Evita scroll horizontal por carrusel full-width */
          }
        }

        /* Mobile L padding aumentado (481px - 767px) */
        @media (min-width: 481px) and (max-width: 767px) {
          .main-content {
            padding: 0 24px 24px 24px;
          }
        }

        /* Tablet (768px - 1023px): Contenido max 720px centrado */
        @media (min-width: 768px) and (max-width: 1023px) {
          .responsive-layout {
            grid-template-columns: 1fr;
            grid-template-areas: "content";
          }
          
          .main-content {
            grid-area: content;
            padding: 0 24px 32px 24px;
            max-width: 720px;
            margin: 0 auto;
            width: 100%;
          }
        }

        /* Desktop S (1024px - 1199px): Contenido max 900px centrado */
        @media (min-width: 1024px) and (max-width: 1199px) {
          .responsive-layout {
            grid-template-columns: 1fr;
            grid-template-areas: "content";
          }
          
          .main-content {
            grid-area: content;
            padding: 0 32px 40px 32px;
            max-width: 900px;
            margin: 0 auto;
            width: 100%;
          }
        }

        /* Desktop M (1200px - 1439px): 3 columnas con sidebars 160px */
        @media (min-width: 1200px) and (max-width: 1439px) {
          .responsive-layout {
            grid-template-columns: 160px 1fr 160px;
            grid-template-areas: "sidebar-left content sidebar-right";
          }
          
          .sidebar-left,
          .sidebar-right {
            display: block;
          }
          
          .sidebar-left {
            grid-area: sidebar-left;
          }
          
          .sidebar-right {
            grid-area: sidebar-right;
          }
          
          .main-content {
            grid-area: content;
            padding: 0 32px 40px 32px;
            max-width: 1024px;
            margin: 0 auto;
            width: 100%;
          }
        }

        /* Desktop L (1440px - 1919px): 3 columnas con sidebars 200px */
        @media (min-width: 1440px) and (max-width: 1919px) {
          .responsive-layout {
            grid-template-columns: 200px 1fr 200px;
            grid-template-areas: "sidebar-left content sidebar-right";
          }
          
          .sidebar-left,
          .sidebar-right {
            display: block;
          }
          
          .sidebar-left {
            grid-area: sidebar-left;
          }
          
          .sidebar-right {
            grid-area: sidebar-right;
          }
          
          .main-content {
            grid-area: content;
            padding: 0 40px 48px 40px;
            max-width: 1200px;
            margin: 0 auto;
            width: 100%;
          }
        }

        /* Desktop XL (≥1920px): 3 columnas con sidebars 280px, contenido fijo 1200px */
        @media (min-width: 1920px) {
          .responsive-layout {
            grid-template-columns: 280px 1fr 280px;
            grid-template-areas: "sidebar-left content sidebar-right";
            background: #f5f5f5; /* Fondo gris para el espacio vacío */
          }
          
          .sidebar-left,
          .sidebar-right {
            display: block;
          }
          
          .sidebar-left {
            grid-area: sidebar-left;
            background: white;
          }
          
          .sidebar-right {
            grid-area: sidebar-right;
            background: white;
          }
          
          .main-content {
            grid-area: content;
            padding: 0 40px 48px 40px;
            max-width: 1200px;
            width: 1200px;
            margin: 0 auto;
            background: white;
          }
        }
      `}</style>
    </div>
  );
}