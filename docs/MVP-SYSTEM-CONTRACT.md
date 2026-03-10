# FASE PRE-SUPABASE: Data Model Inventory & Contract Design

Este documento contiene el análisis arquitectónico necesario para reemplazar `mocks.ts` con un contrato de base de datos en Supabase (PostgreSQL). Constituye la verdad absoluta de diseño antes de ejecutar comandos SQL o instanciar servicios de persistencia en la Fase 2.

---

## A. Inventario de Entidades Actuales (en `mocks.ts`)

Las entidades han crecido orgánicamente en `mocks.ts`. Identificamos las siguientes sub-estructuras vitales que la UI y los repositorios ya están usando hoy:

| Nombre de Entidad en Mock          | Origen (Línea aprox) | Repositorio Consumidor | Campos Actuales | Estimación de Tipo (TS) |
|:--- |:--- |:--- |:--- |:--- |
| **`MockProfile`** | L:93 | `authRepo`, `profilesRepo` | `id`, `email`, `username`, `full_name`, `hub_role`, `status`, `password_set`, `created_at`, `last_login_at`, `avatar_url`, `permissions (json)` | Objeto / Registro |
| **`MockProject`** | L:311 | `projectsRepo`, `homeRepo` | `id`, `slug`, `name`, `description`, `image_url`, `status`, `public_url`, `admin_url`, `sso_mode`, `show_in_home`, `version`, `last_update_at`, `last_update_label` | Objeto / Registro |
| **`PROJECT_COPY`** | L:57 | `projectsRepo` | Mapa `{ slug: { short, long } }` | Objeto / Registro |
| **`MockUserProjectAccess`** | L:899 | `accessesRepo` | `user_id`, `project_slug`, `can_view`, `can_admin` | Intersección N:M |
| **`MockHomeBranding`** | L:689 | `homeRepo` | `logo_url`, `claim` | Configuración / Singleton |
| **`MockHomeHero`** / `MockHeroImage` | L:694 | `homeRepo` | `headline`, `carousel_images (id, image_url, order)` | Entidad + 1:N Relacional |
| **`MockProjectDetail`** / `MockProjectDetailBlock`| L:710 | `homeRepo` | `project_slug`, `blocks (id, type: text/image/video, content, order)` | 1:N Relacional (Bloques) |
| **`MockAuditLog`** | L:574 | `auditRepo` | `at`, `actor_email`, `action`, `entity`, `entity_ref` | Historial (Append-only) |

---

## B. Propuesta de tablas Supabase MVP (PostgreSQL)

Mapearemos el inventario a un modelo relacional normalizado:

1. **`profiles`**
   - Tabla principal de usuarios en el sistema. Debe extender de `auth.users` provisto por Supabase de forma nativa por medio de un trigger.
2. **`projects`**
   - Unificará `MockProject` y `PROJECT_COPY`. (No tiene sentido crear una tabla extra solo para el copy largo).
3. **`user_project_accesses`**
   - Tabla pivote resolviendo la relación Muchos a Muchos (N:M) de la seguridad de navegación.
4. **`home_branding`**
   - Tabla Singleton (1 sola fila siempre) con los datos del logo y claim.
5. **`home_hero`**
   - Tabla Singleton (1 sola fila siempre) con el headline principal.
6. **`hero_images`**
   - Tabla asociada 1:N con `home_hero`. Guarda el array que antes vivía en JSON para permitir orden dinámico.
7. **`project_details`**
   - Renombrada internamente representará a los **Bloques** del proyecto. La entidad padre ya es `projects`.
8. **`audit_logs`**
   - Tabla pura para almacenar tracking de sistema de manera indexable y segura.

---

## C. Campos por tabla (Tipado MVP propuesto)

### 1. `profiles`
- `id` (uuid, PK, References `auth.users`)
- `email` (text, unique)
- `username` (text, unique, nullable)
- `full_name` (text)
- `hub_role` (enum: 'superadmin', 'admin', 'member', 'disabled') - Def: 'member'
- `status` (enum: 'active', 'disabled') - Def: 'active'
- `password_set` (boolean) - Def: false
- `avatar_url` (text, nullable)
- `permissions_home_editor` (boolean) - Destrucción del objeto JSON `permissions` para campos estrictos booleanos.
- `permissions_hub_projects_editor` (boolean)
- `created_at` (timestamptz)
- `last_login_at` (timestamptz)

### 2. `projects`
- `id` (uuid, PK)
- `slug` (text, unique)
- `name` (text)
- `description_short` (text) *- Absorbe parte de PROJECT_COPY*
- `description_long` (text) *- Absorbe parte de PROJECT_COPY*
- `image_url` (text, nullable)
- `status` (enum: 'live', 'in_development', 'coming_soon')
- `public_url` (text, nullable)
- `admin_url` (text, nullable)
- `sso_mode` (enum: 'none', 'sso_light')
- `show_in_home` (boolean)
- `version` (text, nullable)
- `updated_at` (timestamptz) *- Absorbe timestamp, la UI calcula la etiqueta de fecha ('Hace X días').*
- `created_at` (timestamptz)

### 3. `user_project_accesses`
- `id` (uuid, PK)
- `user_id` (uuid, FK `profiles.id`, onDelete cascade)
- `project_id` (uuid, FK `projects.id`, onDelete cascade)
- `can_view` (boolean)
- `can_admin` (boolean)
- *Constraint: UNIQUE (user_id, project_id)*

### 4. `home_branding` (Singleton)
- `id` (int, PK) - Siempre 1
- `logo_url` (text, nullable)
- `claim` (text)

### 5. `home_hero` (Singleton)
- `id` (int, PK) - Siempre 1
- `headline` (text)

### 6. `hero_images`
- `id` (uuid, PK)
- `image_url` (text)
- `order_index` (int)

### 7. `project_blocks` (Reemplaza a MockProjectDetailBlock)
- `id` (uuid, PK)
- `project_id` (uuid, FK `projects.id`, onDelete cascade)
- `type` (enum: 'text', 'image', 'video')
- `content` (text)
- `order_index` (int)

### 8. `audit_logs`
- `id` (uuid, PK)
- `created_at` (timestamptz)
- `actor_email` (text)
- `action` (text)
- `entity` (text)
- `entity_ref` (text)

---

## D. Relaciones entre tablas (Cardinalidad)

- **`profiles` (1) <---> (N) `user_project_accesses` (N) <---> (1) `projects`**
- **`projects` (1) <---> (N) `project_blocks`** *(Para el detalle estético en el Home)*
- **`home_hero` (1) <---> (N) `hero_images`**

---

## E. Elementos que quedan FUERA del MVP

Al movernos de los mocks temporales a infraestructura nativa backendless (Supabase), varías partes puramente "técnicas de local" no deben pasar a las tablas:

1. **`mockUiState` (UI State Flags)**
   - Valores paralizados o de testing de errores de `loading: false / error: false`. Esto se maneja directo en React mediante Query o useEffect + Catch.
2. **`mockAuthState` (Manejo local pre-login)**
   - No necesitamos almacenar `isLoading` ni la gestión de correo local. Supabase `auth.getSession()` gestionará la cookie firmada.
3. **`mockSsoSessions` / `MockSsoSession` en memoria (`ssoRepo`)**
   - El ecosistema "SSO Light" generaba localmente una URL de 5 minutos mediante un Hash temporal que residía en la RAM del navegador. Pasarlo a PostgreSQL implica infraestructura ajena al MVP. En esta Fase inicial, las URL serán estáticas de acceso.
4. **`last_update_label` de Projects**
   - El texto "Hace 3 días". Un backend solo devuelve el ISO DateTime (`updated_at`), la UI (por ejemplo, con `date-fns`) se encarga de serializar la palabra "Hace 3 días".
5. **Autenticación "Magic Link sin Confirmar" `mockSendMagicLink`**
   - Existía el mecanismo donde cualquier email no registrado creaba un perfil en el acto. Esto será resuelto puramente con Auth de Supabase (las políticas RLS nos impedirán insertar a menos que haya Auth válido).

---

## F. Mapeo Repo Actual -> Tabla Supabase Futura

| Repositorio Proxy Actual | Entidad Postgres Designada | Función en Fase 2 |
|:---:|:---:|:--- |
| `authRepo.ts` | **`auth.users`** (Nativo DB) | Logins, Sesiones y Magic Links usando las SDKs `@supabase.auth`. |
| `profilesRepo.ts` | **`public.profiles`** | Gestor de RLS (Record-level-Security) de quién puede leer a quién. |
| `projectsRepo.ts` | **`public.projects`** | Consumo y CRUD de Hub. |
| `homeRepo.ts` | **`home_branding`, `home_hero`, `hero_images`, `project_blocks`** | Expondrá 4 selects ligeros asincrónicos para pintar el portfolio público. |
| `accessesRepo.ts` | **`public.user_project_accesses`** | Intermediario Pivot para cruces de autorización con inner joins y RPCs. |
| `auditRepo.ts` | **`public.audit_logs`** | Write-only desde la UI u originado desde la DB mediante Triggers SQL. |
| `ssoRepo.ts` | *A confirmar (Queda fuera del Scope temporal).* | --- |


---

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
