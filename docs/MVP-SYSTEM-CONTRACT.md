# MVP System Contract

Documento canónico de arquitectura, rutas y entidades para el MVP de HCR Sol.

## 1. Route Map Canónico

### Public
Accesibles sin autenticación.
- `/` - Home público.
- `/projects` - Alias de Home (sección proyectos).
- `/projects/:slug` - Detalle público del proyecto.
- `/login` - Login (redirige a `/hub` si ya está autenticado).

### Hub (Protected)
Requiere autenticación. Layout: `HubAuthLayout`.
- `/hub` - Dashboard principal (Lista de proyectos).
- `/hub/perfil` - Perfil de usuario.

### Superadmin (Protected + Role Guard)
Requiere rol `superadmin` o permisos específicos.
- `/hub/superadmin` - Dashboard de administración.
- `/hub/superadmin/home-manager` - Gestión del Home Público.
  - `/hub/superadmin/home-manager/logo` - Branding (Logo, Claim).
  - `/hub/superadmin/home-manager/carrusel-principal` - Hero Images.
- `/hub/superadmin/hub-project-manager` - Gestión de Proyectos.
  - `/hub/superadmin/hub-project-manager` (Index) - Lista.
  - `/hub/superadmin/hub-project-manager/crear` - Crear proyecto.
  - `/hub/superadmin/hub-project-manager/editar/:slug` - Editar proyecto.
- `/hub/superadmin/users-manager` - Gestión de Usuarios.
  - `/hub/superadmin/users-manager` (Index) - Lista.
  - `/hub/superadmin/users-manager/crear` - Crear usuario.
  - `/hub/superadmin/users-manager/editar/:id` - Editar usuario.
  - `/hub/superadmin/users-manager/accesos/:id` - Gestionar accesos a proyectos.

### Gateway (Protected)
Sin Layout de Hub (o layout mínimo).
- `/hub/proyecto/:slug/gateway` - Punto de entrada a aplicaciones externas/internas gestionadas.

## 2. Layouts y Guards

### Layouts
- **MainLayout**: Layout base (Header público, Footer). Usado en rutas públicas.
- **HubAuthLayout**: Layout de aplicación (Sidebar/Navbar de navegación interna). Usado en `/hub`.

### Guards
- **PublicToHubRedirect**:
  - Si el usuario está autenticado y visita public/login, redirige a `/hub`.
- **ProtectedRoute**:
  - Verifica si existe sesión activa.
  - Si no, redirige a `/login`.
- **RequirePermission**:
  - Verifica roles (`requireSuperadmin`) o permisos granulares (`home_editor`, `hub_projects_editor`).
  - Si falla, muestra 403 o redirige.

## 3. Entidades MVP ↔ Tablas Supabase (Propuesta)

Mapeo de las entidades actuales (Mocks) a esquema relacional sugerido.

### Core
| Entidad (Mock) | Tabla Sugerida (`public`) | Descripción |
| :--- | :--- | :--- |
| `MockProfile` | `profiles` | Extensión de `auth.users`. Campos: `username`, `full_name`, `hub_role`, `status`, `avatar_url`, `created_at`, `last_login_at`. |
| `MockProject` | `projects` | Proyectos del sistema. Campos: `slug` (PK/Unique), `name`, `description`, `image_url`, `status`, `public_url`, `admin_url`, `sso_mode`, `show_in_home`, `version`. |
| `MockUserProjectAccess` | `project_access` | Relación M:N Users-Projects. Campos: `user_id`, `project_slug` (FK), `can_view` (bool), `can_admin` (bool). |

### Content Management (Home)
| Entidad (Mock) | Tabla Sugerida (`public`) | Descripción |
| :--- | :--- | :--- |
| `MockHomeBranding` | `home_branding` | Tabla singleton. Campos: `logo_url`, `claim`. |
| `MockHomeHero` | `home_hero` | Tabla singleton o configuración. `headline`. |
| `MockHeroImage` | `home_hero_images` | Imágenes del carrusel principal. Campos: `image_url`, `order`. |
| `MockCarouselProject` | `home_carousel_projects` | Relación ordenada de proyectos destacados. Campos: `project_slug` (FK), `type` ('dev'/'done'), `order`. |
| `MockProjectDetail` | `project_details` | Detalles extendidos para página pública. Campos: `project_slug` (FK). |
| `MockProjectDetailBlock`| `project_detail_blocks` | Bloques de contenido. Campos: `project_slug` (FK), `type` ('text'/'image'), `content`, `order`. |

### System
| Entidad (Mock) | Tabla Sugerida (`public`) | Descripción |
| :--- | :--- | :--- |
| `MockAuditLog` | `audit_logs` | Registro de actividad. Campos: `actor_id`, `action`, `entity`, `entity_ref`, `created_at`. |
| `MockSsoSession` | **N/A** (Redis/Edge) | Tokens volátiles. NO persistir en DB (ver ADR-001). |

## 4. Keep / Deprecate / Remove

Estado de los artefactos actuales del código.

### Keep (Mantener)
- Arquitectura de Routing actual (`App.tsx`).
- Estructura de Mocks (`src/data/mocks.ts`) hasta migración completa.
- Sistema de Guards (`ProtectedRoute`, `RequirePermission`).
- Componentes de Layout (`HubAuthLayout`, `MainLayout`).

### Deprecate (Desaconsejado / A migrar)
- Rutas legacy en `App.tsx`:
  - `/hub/usuarios` (Reemplazado por `UsersManager`).
  - `/hub/auditoria` (Mover a `superadmin/auditoria` o similar si es necesario).
  - Redirects: `/hub/usuarios-old`, `/hub/auditoria-old`.
- `mockProjectAccess` (Array antiguo en `mocks.ts`): Usar `mockUserProjectAccesses`.
- `MockUser` (Interfaz antigua): Usar `MockProfile`.

### Remove (Eliminar)
- Componentes de páginas legacy una vez confirmada la migración (`Users.tsx`, `Audit.tsx` si ya no se usan).
- Referencias a `mockProjectAccess` vacío.
