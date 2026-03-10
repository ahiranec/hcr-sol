-- -----------------------------------------------------------------------------
-- BASE DATOS MVP - SCHEMAS Y ESTRUCTURAS - Supabase PostgreSQL
-- -----------------------------------------------------------------------------

-- Habilitar extensión requerida
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- 1. TABLAS PRINCIPALES
-- ==========================================

-- Tabla de perfiles (Profiles)
CREATE TABLE public.profiles (
    id uuid NOT NULL PRIMARY KEY, -- Referencia a auth.users.id
    email text UNIQUE NOT NULL,
    full_name text NOT NULL,
    username text UNIQUE,
    hub_role text NOT NULL DEFAULT 'member',
    status text NOT NULL DEFAULT 'active',
    password_set boolean NOT NULL DEFAULT false,
    avatar_url text,
    created_at timestamptz NOT NULL DEFAULT now(),
    last_login_at timestamptz,
    CONSTRAINT chk_profiles_hub_role CHECK (hub_role IN ('superadmin', 'member')),
    CONSTRAINT chk_profiles_status CHECK (status IN ('active', 'disabled'))
);

-- Tabla de proyectos del Hub (Projects)
CREATE TABLE public.projects (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    slug text UNIQUE NOT NULL,
    name text NOT NULL,
    short_description text NOT NULL,
    long_description text NOT NULL,
    image_url text,
    status text NOT NULL DEFAULT 'coming_soon',
    public_url text,
    admin_url text,
    sso_mode text NOT NULL DEFAULT 'none',
    show_in_home boolean NOT NULL DEFAULT false,
    version text,
    last_update_at timestamptz NOT NULL DEFAULT now(),
    last_update_label text,
    CONSTRAINT chk_projects_status CHECK (status IN ('in_development', 'live', 'coming_soon')),
    CONSTRAINT chk_projects_sso_mode CHECK (sso_mode IN ('none', 'sso_light'))
);

-- ==========================================
-- 2. TABLAS DE RELACIÓN (Pivot)
-- ==========================================

-- Accesos de usuarios a proyectos (user_project_accesses)
CREATE TABLE public.user_project_accesses (
    user_id uuid NOT NULL,
    project_id uuid NOT NULL,
    can_view boolean NOT NULL DEFAULT true,
    can_admin boolean NOT NULL DEFAULT false,
    PRIMARY KEY (user_id, project_id),
    CONSTRAINT fk_accesses_user FOREIGN KEY (user_id) REFERENCES public.profiles (id) ON DELETE CASCADE,
    CONSTRAINT fk_accesses_project FOREIGN KEY (project_id) REFERENCES public.projects (id) ON DELETE CASCADE,
    CONSTRAINT chk_accesses_logic CHECK (NOT can_admin OR can_view)
);

-- ==========================================
-- 3. TABLAS DE CONFIGURACIÓN DEL HOME
-- ==========================================

-- Branding del home (Singleton)
CREATE TABLE public.home_branding (
    id int NOT NULL PRIMARY KEY CHECK (id = 1),
    logo_url text,
    claim text NOT NULL
);

-- Hero del home (Singleton)
CREATE TABLE public.home_hero (
    id int NOT NULL PRIMARY KEY CHECK (id = 1),
    headline text NOT NULL
);

-- Imágenes del carrusel del Hero (hero_images)
CREATE TABLE public.hero_images (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    home_hero_id int NOT NULL,
    image_url text NOT NULL,
    order_index int NOT NULL DEFAULT 0,
    CONSTRAINT fk_hero_images_hero FOREIGN KEY (home_hero_id) REFERENCES public.home_hero (id) ON DELETE CASCADE
);

-- Bloques de detalle de proyectos (project_blocks)
CREATE TABLE public.project_blocks (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id uuid NOT NULL,
    type text NOT NULL,
    content text NOT NULL,
    order_index int NOT NULL DEFAULT 0,
    CONSTRAINT chk_project_blocks_type CHECK (type IN ('text', 'image', 'video')),
    CONSTRAINT fk_project_blocks_project FOREIGN KEY (project_id) REFERENCES public.projects (id) ON DELETE CASCADE
);

-- ==========================================
-- 4. TABLAS DE SISTEMA
-- ==========================================

-- Registro de Auditoría (Audit Log)
CREATE TABLE public.audit_log (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    at timestamptz NOT NULL DEFAULT now(),
    actor_email text NOT NULL,
    action text NOT NULL,
    entity text NOT NULL,
    entity_ref text
);

-- ==========================================
-- 5. ÍNDICES DE RENDIMIENTO (Performance Indexes)
-- ==========================================

CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_projects_slug ON public.projects(slug);
CREATE INDEX idx_user_project_accesses_project_id ON public.user_project_accesses(project_id);
CREATE INDEX idx_hero_images_order ON public.hero_images(home_hero_id, order_index);
CREATE INDEX idx_project_blocks_order ON public.project_blocks(project_id, order_index);
CREATE INDEX idx_audit_log_at ON public.audit_log(at DESC);
CREATE INDEX idx_audit_log_actor ON public.audit_log(actor_email);
