// Mock data for Stage 1 - Public Site
export const MOCK_PROJECTS = [
  // Proyectos en desarrollo
  {
    slug: 'whatsapp-reader',
    name: 'WhatsApp Reader',
    status: 'in_development' as const,
    publicUrl: null,
    description: 'Lector de textos de WhatsApp e intérprete de tendencias',
    version: 'Beta 1.0',
    lastUpdated: 'hace 3 días',
    imageUrl: 'https://placehold.co/600x400/25D366/white?text=WhatsApp+Reader',
  },
  {
    slug: 'listlyup',
    name: 'ListlyUp',
    status: 'in_development' as const,
    publicUrl: null,
    description: 'Marketplace local con geolocalización y grupos de contacto',
    version: 'v1.2 Alpha',
    lastUpdated: 'hace 1 semana',
    imageUrl: 'https://placehold.co/600x400/FF6B35/white?text=ListlyUp',
  },
  {
    slug: 'babelapi',
    name: 'BabelAPI',
    status: 'in_development' as const,
    publicUrl: null,
    description: 'Aplicación de conversación con distintas inteligencias artificiales',
    version: 'Beta 2.1',
    lastUpdated: 'hace 5 días',
    imageUrl: 'https://placehold.co/600x400/6366F1/white?text=BabelAPI',
  },
  // Proyectos disponibles
  {
    slug: 'powerbi-molino-balmaceda',
    name: 'Power BI Panel Molino Balmaceda',
    status: 'live' as const,
    publicUrl: 'https://powerbi-molino.ejemplo.com',
    description: 'Panel de control de resultados de Molino Armazea',
    version: 'v2.0',
    lastUpdated: 'hace 2 días',
    imageUrl: 'https://placehold.co/600x400/F2C94C/333333?text=Power+BI+Panel',
  },
  {
    slug: 'hcrsol-landing-page',
    name: 'HCR Sol Landing Page',
    status: 'live' as const,
    publicUrl: 'https://hcrsol.ejemplo.com',
    description: 'Landing page de web corporativa',
    version: 'v1.5',
    lastUpdated: 'hace 1 semana',
    imageUrl: 'https://placehold.co/600x400/3B82F6/white?text=HCR+Sol',
  },
];

export const PROJECT_COPY: Record<string, { short: string; long: string }> = {
  'whatsapp-reader': {
    short: 'Lector de textos de WhatsApp e intérprete de tendencias',
    long: 'Herramienta avanzada que analiza conversaciones de WhatsApp para identificar patrones, tendencias y generar insights automatizados.',
  },
  'listlyup': {
    short: 'Marketplace local con geolocalización y grupos de contacto',
    long: 'Plataforma de marketplace que conecta compradores y vendedores locales mediante geolocalización inteligente y grupos comunitarios.',
  },
  'babelapi': {
    short: 'Aplicación de conversación con distintas inteligencias artificiales',
    long: 'Interfaz unificada para interactuar con múltiples modelos de IA, permitiendo comparar respuestas y obtener diferentes perspectivas.',
  },
  'powerbi-molino-balmaceda': {
    short: 'Panel de control de resultados de Molino Armazea',
    long: 'Dashboard integral de Power BI para monitoreo en tiempo real de KPIs operacionales y resultados del Molino Balmaceda.',
  },
  'hcrsol-landing-page': {
    short: 'Landing page de web corporativa',
    long: 'Sitio web institucional moderno y responsive que presenta los servicios, valores y portafolio de proyectos de HCR Sol.',
  },
};

// UI State flags para simular loading/error en Mock Level 0
export const mockUiState = {
  loading: false, // Cambiar a true para ver estado de carga
  error: false,   // Cambiar a true para ver estado de error
};

// ==========================================
// STAGE 2: AUTH MOCKS (MOCK LEVEL 0)
// ==========================================

export type HubRole = 'superadmin' | 'admin' | 'member' | 'disabled';
export type UserStatus = 'active' | 'disabled';

export interface MockProfile {
  id: string;                    // NUEVO - unificación con MockUser
  email: string;
  username: string | null;       // NUEVO - username corto tipo @ahirane
  full_name: string;
  hub_role: HubRole;
  status: UserStatus;
  password_set: boolean;         // NUEVO - false = pendiente establecer contraseña
  created_at: number;            // NUEVO - timestamp de creación
  last_login_at: number | null;  // NUEVO - timestamp último login
  avatar_url?: string | null;
  permissions?: {
    home_editor: boolean;
    hub_projects_editor: boolean;
  };
}

// Perfiles de usuario para simular diferentes casos
export const mockProfiles: MockProfile[] = [
  {
    id: '1',
    email: 'ahirane@gmail.com',
    username: 'ahirane',
    full_name: 'Ahirane',
    hub_role: 'superadmin',
    status: 'active',
    password_set: true,
    created_at: Date.now() - (1000 * 60 * 60 * 24 * 90), // Hace 90 días
    last_login_at: Date.now() - (1000 * 60 * 30), // Hace 30 minutos
    avatar_url: null,
    permissions: {
      home_editor: true,
      hub_projects_editor: true,
    },
  },
  {
    id: '2',
    email: 'criosu@gmail.com',
    username: 'criosu',
    full_name: 'Criosu',
    hub_role: 'superadmin',
    status: 'active',
    password_set: true,
    created_at: Date.now() - (1000 * 60 * 60 * 24 * 75), // Hace 75 días
    last_login_at: Date.now() - (1000 * 60 * 60 * 2), // Hace 2 horas
    avatar_url: null,
    permissions: {
      home_editor: true,
      hub_projects_editor: true,
    },
  },
  {
    id: '3',
    email: 'ahiraner@gmail.com',
    username: 'ahiraner',
    full_name: 'Ahiraner',
    hub_role: 'member',
    status: 'active',
    password_set: true,
    created_at: Date.now() - (1000 * 60 * 60 * 24 * 45), // Hace 45 días
    last_login_at: Date.now() - (1000 * 60 * 60 * 3), // Hace 3 horas
    avatar_url: null,
  },
];

// Estado de autenticación simulado
export const mockAuthState = {
  // Cambiar estos valores para simular diferentes usuarios
  // null = no autenticado
  // email del usuario para autenticado
  currentUserEmail: null as string | null,

  // Estado de carga de autenticación
  isLoading: false,

  // Estado de error en login
  loginError: null as string | null,
};

// Helper para obtener usuario actual
export function getCurrentUser(): MockProfile | null {
  if (!mockAuthState.currentUserEmail) return null;
  return mockProfiles.find(p => p.email === mockAuthState.currentUserEmail) || null;
}

// Helper para simular login
export function mockLogin(email: string, password: string): boolean {
  // Simular delay de red
  mockAuthState.isLoading = true;

  // Validar que se proporcione email y password
  if (!email || !password) {
    mockAuthState.loginError = 'No se pudo iniciar sesión. Verifica tus datos.';
    mockAuthState.isLoading = false;
    return false;
  }

  // Buscar si el usuario existe en los perfiles predefinidos
  const user = mockProfiles.find(p => p.email === email);

  // Si el usuario existe en los perfiles predefinidos
  if (user) {
    if (user.status === 'disabled') {
      mockAuthState.loginError = 'Tu cuenta está deshabilitada. Contacta al administrador.';
      mockAuthState.isLoading = false;
      return false;
    }

    // Login exitoso para usuario predefinido
    mockAuthState.currentUserEmail = email;
    mockAuthState.loginError = null;
    mockAuthState.isLoading = false;
    return true;
  }

  // Para Mock Level 0: aceptar cualquier email válido con contraseña
  // y crear un perfil temporal como 'member' activo
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(email)) {
    // Crear perfil temporal si no existe
    const existingProfile = mockProfiles.find(p => p.email === email);
    if (!existingProfile) {
      mockProfiles.push({
        id: Date.now().toString(),
        email: email,
        username: email.split('@')[0],
        full_name: email.split('@')[0],
        hub_role: 'member',
        status: 'active',
        password_set: true,
        created_at: Date.now(),
        last_login_at: Date.now(),
      });
    }

    // Login exitoso
    mockAuthState.currentUserEmail = email;
    mockAuthState.loginError = null;
    mockAuthState.isLoading = false;
    return true;
  }

  // Email inválido
  mockAuthState.loginError = 'No se pudo iniciar sesión. Verifica tus datos.';
  mockAuthState.isLoading = false;
  return false;
}

// Helper para simular magic link
export function mockSendMagicLink(email: string): boolean {
  mockAuthState.isLoading = true;

  // Validar que se proporcione email
  if (!email) {
    mockAuthState.loginError = 'No se pudo iniciar sesión. Verifica tus datos.';
    mockAuthState.isLoading = false;
    return false;
  }

  // Buscar si el usuario existe en los perfiles predefinidos
  const user = mockProfiles.find(p => p.email === email);

  // Si el usuario existe en los perfiles predefinidos
  if (user) {
    if (user.status === 'disabled') {
      mockAuthState.loginError = 'Tu cuenta está deshabilitada. Contacta al administrador.';
      mockAuthState.isLoading = false;
      return false;
    }

    mockAuthState.isLoading = false;
    return true;
  }

  // Para Mock Level 0: aceptar cualquier email válido
  // y crear un perfil temporal como 'member' activo
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(email)) {
    // Crear perfil temporal si no existe
    const existingProfile = mockProfiles.find(p => p.email === email);
    if (!existingProfile) {
      mockProfiles.push({
        id: Date.now().toString(),
        email: email,
        username: email.split('@')[0],
        full_name: email.split('@')[0],
        hub_role: 'member',
        status: 'active',
        password_set: true,
        created_at: Date.now(),
        last_login_at: Date.now(),
      });
    }

    mockAuthState.isLoading = false;
    return true;
  }

  // Email inválido
  mockAuthState.loginError = 'No se pudo iniciar sesión. Verifica tus datos.';
  mockAuthState.isLoading = false;
  return false;
}

// Helper para simular logout
export function mockLogout(): void {
  mockAuthState.currentUserEmail = null;
  mockAuthState.loginError = null;
  mockAuthState.isLoading = false;
}

// ==========================================
// STAGE 3: HUB PROJECTS MOCKS (MOCK LEVEL 0)
// ==========================================

export type ProjectStatus = 'live' | 'in_development' | 'coming_soon';
export type SsoMode = 'none' | 'sso_light';

export interface MockProject {
  id: string;
  slug: string;
  name: string;
  description?: string;                      // NUEVO
  image_url?: string | null;                 // NUEVO
  status: ProjectStatus;
  public_url: string | null;
  admin_url: string | null;
  sso_mode: SsoMode;
  show_in_home?: boolean;                    // NUEVO - Visibilidad en Home público
  version?: string;                          // NUEVO - Versión del proyecto (ej: "Beta 1.0", "v2.0")
  last_update_at?: number;                   // NUEVO (timestamp)
  last_update_label?: string;                // NUEVO (ej: "Hace 2 días")
}

export interface MockProjectAccess {
  user_email: string;
  project_slug: string;
  can_open: boolean;
}

// Proyectos en el Hub (completo)
export const mockProjects: MockProject[] = [
  // Proyectos migrados desde MOCK_PROJECTS - EN DESARROLLO
  {
    id: '1',
    slug: 'whatsapp-reader',
    name: 'WhatsApp Reader',
    description: 'Lector de textos de WhatsApp e intérprete de tendencias',
    image_url: 'https://placehold.co/600x400/25D366/white?text=WhatsApp+Reader',
    status: 'in_development',
    public_url: null,
    admin_url: null,
    sso_mode: 'none',
    show_in_home: true,
    version: 'Beta 1.0',
    last_update_at: Date.now() - (1000 * 60 * 60 * 24 * 3), // Hace 3 días
    last_update_label: 'hace 3 días',
  },
  {
    id: '2',
    slug: 'listlyup',
    name: 'ListlyUp',
    description: 'Marketplace local con geolocalización y grupos de contacto',
    image_url: 'https://placehold.co/600x400/FF6B35/white?text=ListlyUp',
    status: 'in_development',
    public_url: null,
    admin_url: null,
    sso_mode: 'none',
    show_in_home: true,
    version: 'v1.2 Alpha',
    last_update_at: Date.now() - (1000 * 60 * 60 * 24 * 7), // Hace 1 semana
    last_update_label: 'hace 1 semana',
  },
  {
    id: '3',
    slug: 'babelapi',
    name: 'BabelAPI',
    description: 'Aplicación de conversación con distintas inteligencias artificiales',
    image_url: 'https://placehold.co/600x400/6366F1/white?text=BabelAPI',
    status: 'in_development',
    public_url: null,
    admin_url: null,
    sso_mode: 'none',
    show_in_home: true,
    version: 'Beta 2.1',
    last_update_at: Date.now() - (1000 * 60 * 60 * 24 * 5), // Hace 5 días
    last_update_label: 'hace 5 días',
  },

  // Proyectos migrados desde MOCK_PROJECTS - DISPONIBLES (LIVE)
  {
    id: '4',
    slug: 'powerbi-molino-balmaceda',
    name: 'Power BI Panel Molino Balmaceda',
    description: 'Panel de control de resultados de Molino Armazea',
    image_url: 'https://placehold.co/600x400/F2C94C/333333?text=Power+BI+Panel',
    status: 'live',
    public_url: 'https://powerbi-molino.ejemplo.com',
    admin_url: null,
    sso_mode: 'none',
    show_in_home: true,
    version: 'v2.0',
    last_update_at: Date.now() - (1000 * 60 * 60 * 24 * 2), // Hace 2 días
    last_update_label: 'hace 2 días',
  },
  {
    id: '5',
    slug: 'hcrsol-landing-page',
    name: 'HCR Sol Landing Page',
    description: 'Landing page de web corporativa',
    image_url: 'https://placehold.co/600x400/3B82F6/white?text=HCR+Sol',
    status: 'live',
    public_url: 'https://hcrsol.ejemplo.com',
    admin_url: null,
    sso_mode: 'none',
    show_in_home: true,
    version: 'v1.5',
    last_update_at: Date.now() - (1000 * 60 * 60 * 24 * 7), // Hace 1 semana
    last_update_label: 'hace 1 semana',
  },
];

// ==========================================
// SISTEMA DE ACCESOS (DEPRECADO - usar mockUserProjectAccesses)
// ==========================================
// NOTA: mockProjectAccess está deprecado. Se mantiene temporalmente para compatibilidad.
// Usar mockUserProjectAccesses (Stage 8) en su lugar.

export const mockProjectAccess: MockProjectAccess[] = [];

// ==========================================
// Helpers para Stage 3 (ACTUALIZADOS para mockUserProjectAccesses)
// ==========================================

export function getUserProjects(userEmail: string, userRole: HubRole): MockProject[] {
  // Superadmin ve todos los proyectos
  if (userRole === 'superadmin') {
    return mockProjects;
  }

  // Buscar usuario por email en mockProfiles (UNIFICADO)
  const user = mockProfiles.find(u => u.email === userEmail);
  if (!user) return [];

  // Member ve solo proyectos con acceso (can_view)
  const userAccess = mockUserProjectAccesses
    .filter(access => access.user_id === user.id && access.can_view)
    .map(access => access.project_slug);

  return mockProjects.filter(project => userAccess.includes(project.slug));
}

export function canUserAccessProject(userEmail: string, userRole: HubRole, projectSlug: string): boolean {
  // Superadmin puede acceder a todo
  if (userRole === 'superadmin') {
    return true;
  }

  // Buscar usuario por email en mockProfiles (UNIFICADO)
  const user = mockProfiles.find(u => u.email === userEmail);
  if (!user) return false;

  // Member necesita permiso explícito de visualización
  const access = mockUserProjectAccesses.find(
    a => a.user_id === user.id && a.project_slug === projectSlug
  );

  return access?.can_view ?? false;
}

export function canUserAdminProject(userEmail: string, userRole: HubRole, projectSlug: string): boolean {
  // Superadmin puede administrar todo
  if (userRole === 'superadmin') {
    return true;
  }

  // Buscar usuario por email en mockProfiles (UNIFICADO)
  const user = mockProfiles.find(u => u.email === userEmail);
  if (!user) return false;

  // Member necesita permiso explícito de administración
  const access = mockUserProjectAccesses.find(
    a => a.user_id === user.id && a.project_slug === projectSlug
  );

  return access?.can_admin ?? false;
}

// OUT_OF_MVP (health monitoring removed from MVP scope)


// ==========================================
// STAGE 4: SSO LIGHT MOCKS (MOCK LEVEL 0)
// ==========================================

export type SsoSessionStatus = 'active' | 'expired' | 'invalid';

export interface MockSsoSession {
  token: string;
  project_slug: string;
  user_email: string;
  expires_at: number; // timestamp
  status: SsoSessionStatus;
}

// Sesiones SSO en memoria (mock)
export const mockSsoSessions: MockSsoSession[] = [];

// Estado de simulación para probar errores
export const mockSsoState = {
  // Cambiar a true para simular errores específicos
  forceExpired: false,
  forceInvalid: false,
  forceNoSso: false,
};

// Helpers para Stage 4

// Generar token plano (mock)
function generateMockToken(): string {
  return 'mock_token_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Crear sesión SSO
export function createSsoSession(projectSlug: string, userEmail: string): MockSsoSession {
  const token = generateMockToken();
  const expiresAt = Date.now() + (5 * 60 * 1000); // 5 minutos desde ahora

  const session: MockSsoSession = {
    token,
    project_slug: projectSlug,
    user_email: userEmail,
    expires_at: expiresAt,
    status: 'active',
  };

  // Agregar a la lista (simula persistencia)
  mockSsoSessions.push(session);

  return session;
}

// Verificar si una sesión es válida
export function validateSsoSession(token: string): { valid: boolean; reason?: string } {
  // Forzar estados para testing
  if (mockSsoState.forceExpired) {
    return { valid: false, reason: 'expired' };
  }

  if (mockSsoState.forceInvalid) {
    return { valid: false, reason: 'invalid' };
  }

  const session = mockSsoSessions.find(s => s.token === token);

  if (!session) {
    return { valid: false, reason: 'invalid' };
  }

  if (session.status === 'invalid') {
    return { valid: false, reason: 'invalid' };
  }

  if (session.status === 'expired' || Date.now() > session.expires_at) {
    return { valid: false, reason: 'expired' };
  }

  return { valid: true };
}

// Construir URL de admin con token
export function buildSsoAdminUrl(adminUrl: string, token: string): string {
  const url = new URL(adminUrl);
  url.searchParams.set('token', token);
  return url.toString();
}

// ==========================================
// STAGE 6: AUDIT LOG MOCKS (MOCK LEVEL 0)
// ==========================================

export interface MockAuditLog {
  at: number; // timestamp
  actor_email: string;
  action: string;
  entity: string;
  entity_ref: string;
}

// Eventos de auditoría del sistema
export const mockAuditLog: MockAuditLog[] = [
  {
    at: Date.now() - (1000 * 60 * 60 * 2), // Hace 2 horas
    actor_email: 'admin@hcrsol.com',
    action: 'Acceso al panel',
    entity: 'Project',
    entity_ref: 'portal-clientes',
  },
  {
    at: Date.now() - (1000 * 60 * 60 * 24), // Hace 1 día
    actor_email: 'miembro@hcrsol.com',
    action: 'Acceso al panel',
    entity: 'Project',
    entity_ref: 'portal-clientes',
  },
  {
    at: Date.now() - (1000 * 60 * 60 * 24 * 2), // Hace 2 días
    actor_email: 'admin@hcrsol.com',
    action: 'Generación de token SSO',
    entity: 'SSO',
    entity_ref: 'portal-clientes',
  },
  {
    at: Date.now() - (1000 * 60 * 60 * 24 * 3), // Hace 3 días
    actor_email: 'admin@hcrsol.com',
    action: 'Inicio de sesión',
    entity: 'User',
    entity_ref: 'admin@hcrsol.com',
  },
  {
    at: Date.now() - (1000 * 60 * 60 * 24 * 3), // Hace 3 días
    actor_email: 'miembro@hcrsol.com',
    action: 'Inicio de sesión',
    entity: 'User',
    entity_ref: 'miembro@hcrsol.com',
  },
  {
    at: Date.now() - (1000 * 60 * 60 * 24 * 5), // Hace 5 días
    actor_email: 'admin@hcrsol.com',
    action: 'Acceso a auditoría',
    entity: 'System',
    entity_ref: 'audit-log',
  },
];

// ==========================================
// NUEVOS HELPERS PARA HUB (FASE 1 + 2)
// ==========================================

// Obtener TODOS los proyectos del Hub (no filtrar por permisos)
export function getAllHubProjects(): MockProject[] {
  return mockProjects;
}

// Verificar si usuario puede acceder al tab Superadmin
export function canAccessSuperadminTab(user: MockProfile | null): boolean {
  if (!user || user.status === 'disabled') return false;

  // Superadmin siempre puede
  if (user.hub_role === 'superadmin') return true;

  // Admin con al menos un permiso delegado puede
  if (user.hub_role === 'admin' && user.permissions) {
    return user.permissions.home_editor || user.permissions.hub_projects_editor;
  }

  return false;
}

// Verificar si usuario puede editar Home público
export function canEditHome(user: MockProfile | null): boolean {
  if (!user || user.status === 'disabled') return false;
  return user.hub_role === 'superadmin' || (user.permissions?.home_editor ?? false);
}

// Verificar si usuario puede editar Hub Projects
export function canEditHubProjects(user: MockProfile | null): boolean {
  if (!user || user.status === 'disabled') return false;
  return user.hub_role === 'superadmin' || (user.permissions?.hub_projects_editor ?? false);
}

// Verificar si usuario puede gestionar usuarios y accesos (SOLO superadmin)
export function canManageUsersAndAccess(user: MockProfile | null): boolean {
  if (!user || user.status === 'disabled') return false;
  return user.hub_role === 'superadmin';
}

// Verificar si usuario tiene acceso a un proyecto específico (nueva versión)
export function hasProjectAccess(user: MockProfile | null, projectSlug: string): boolean {
  if (!user || user.status === 'disabled') return false;

  // Superadmin tiene acceso a todo
  if (user.hub_role === 'superadmin') return true;

  // Verificar en mockProjectAccess
  const access = mockProjectAccess.find(
    a => a.user_email === user.email && a.project_slug === projectSlug
  );

  return access?.can_open ?? false;
}

// ==========================================
// STAGE 7: HOME CONTENT MOCKS (MOCK LEVEL 0)
// ==========================================

export interface MockHomeBranding {
  logo_url: string | null;
  claim: string;
}

export interface MockHeroImage {
  id: string;
  image_url: string;
  order: number;
}

export interface MockHomeHero {
  headline: string;
  carousel_images: MockHeroImage[];
}

export interface MockCarouselProject {
  project_slug: string;
  order: number;
}

export interface MockProjectDetailBlock {
  id: string;
  type: 'text' | 'image' | 'video';
  content: string; // Para text: texto, para image: URL, para video: embed URL
  order: number;
}

export interface MockProjectDetail {
  project_slug: string;
  blocks: MockProjectDetailBlock[];
}

// Branding del Home público
export const mockHomeBranding: MockHomeBranding = {
  logo_url: null, // Por defecto sin logo
  claim: 'Soluciones tecnológicas que impulsan tu negocio',
};

// Hero del Home público
export const mockHomeHero: MockHomeHero = {
  headline: 'Transformamos ideas en experiencias digitales',
  carousel_images: [
    {
      id: '1',
      image_url: 'https://images.unsplash.com/photo-1755029553373-87246d245ec1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5yaXNlJTIwdGVjaG5vbG9neSUyMGdyYWRpZW50JTIwb3JhbmdlfGVufDF8fHx8MTc3MTExNjM3MHww&ixlib=rb-4.1.0&q=80&w=1080',
      order: 1,
    },
    {
      id: '2',
      image_url: 'https://images.unsplash.com/photo-1760629863094-5b1e8d1aae74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwdHJhbnNmb3JtYXRpb24lMjBpbm5vdmF0aW9uJTIwZnV0dXJlfGVufDF8fHx8MTc3MTExNjM2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      order: 2,
    },
  ],
};

// Carrusel de proyectos en desarrollo
export const mockCarouselDev: MockCarouselProject[] = [
  { project_slug: 'whatsapp-reader', order: 1 },
  { project_slug: 'listlyup', order: 2 },
  { project_slug: 'babelapi', order: 3 },
];

// Carrusel de proyectos finalizados
export const mockCarouselDone: MockCarouselProject[] = [
  { project_slug: 'powerbi-molino-balmaceda', order: 1 },
  { project_slug: 'hcrsol-landing-page', order: 2 },
];

// Detalles de proyectos en desarrollo
export const mockProjectDetails: MockProjectDetail[] = [
  {
    project_slug: 'whatsapp-reader',
    blocks: [
      {
        id: '1',
        type: 'text',
        content: 'WhatsApp Reader es una herramienta innovadora que analiza conversaciones de WhatsApp para identificar tendencias y patrones en los mensajes.',
        order: 1,
      },
      {
        id: '2',
        type: 'image',
        content: 'https://images.unsplash.com/photo-1725798451557-fc60db3eb6a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGF0c2FwcCUyMGNoYXQlMjBtZXNzYWdlcyUyMG1vYmlsZXxlbnwxfHx8fDE3NzExMTYwMjN8MA&ixlib=rb-4.1.0&q=80&w=1080',
        order: 2,
      },
      {
        id: '3',
        type: 'text',
        content: 'Características principales: análisis de sentimientos, detección de temas, estadísticas de uso y exportación de reportes.',
        order: 3,
      },
    ],
  },
  {
    project_slug: 'listlyup',
    blocks: [
      {
        id: '1',
        type: 'text',
        content: 'ListlyUp es un marketplace local que conecta compradores y vendedores en tu área, con funcionalidades de geolocalización y grupos de contacto.',
        order: 1,
      },
      {
        id: '2',
        type: 'image',
        content: 'https://images.unsplash.com/photo-1760791964255-012d1edc118b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2NhbCUyMG1hcmtldHBsYWNlJTIwc2hvcHBpbmclMjBtb2JpbGV8ZW58MXx8fHwxNzcxMTE2MDI0fDA&ixlib=rb-4.1.0&q=80&w=1080',
        order: 2,
      },
    ],
  },
  {
    project_slug: 'babelapi',
    blocks: [
      {
        id: '1',
        type: 'text',
        content: 'BabelAPI te permite conversar con múltiples modelos de inteligencia artificial en una sola interfaz, comparando respuestas y obteniendo mejores resultados.',
        order: 1,
      },
      {
        id: '2',
        type: 'image',
        content: 'https://images.unsplash.com/photo-1751448582395-27fc57293f1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwY2hhdGJvdCUyMGNvbnZlcnNhdGlvbnxlbnwxfHx8fDE3NzEwMTE3MTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
        order: 2,
      },
    ],
  },
];

// Helpers para Home Content

export function getHomeBranding(): MockHomeBranding {
  return mockHomeBranding;
}

export function updateHomeBranding(updates: Partial<MockHomeBranding>): void {
  Object.assign(mockHomeBranding, updates);
}

export function getHomeHero(): MockHomeHero {
  return mockHomeHero;
}

export function updateHomeHeroHeadline(headline: string): void {
  mockHomeHero.headline = headline;
}

export function addHeroImage(image_url: string): void {
  const maxOrder = Math.max(0, ...mockHomeHero.carousel_images.map(img => img.order));
  mockHomeHero.carousel_images.push({
    id: Date.now().toString(),
    image_url,
    order: maxOrder + 1,
  });
}

export function removeHeroImage(imageId: string): void {
  mockHomeHero.carousel_images = mockHomeHero.carousel_images.filter(img => img.id !== imageId);
}

export function reorderHeroImages(images: MockHeroImage[]): void {
  mockHomeHero.carousel_images = images;
}

export function getCarouselDev(): MockCarouselProject[] {
  return [...mockCarouselDev].sort((a, b) => a.order - b.order);
}

export function reorderCarouselDev(projects: MockCarouselProject[]): void {
  mockCarouselDev.length = 0;
  mockCarouselDev.push(...projects);
}

export function getCarouselDone(): MockCarouselProject[] {
  return [...mockCarouselDone].sort((a, b) => a.order - b.order);
}

export function reorderCarouselDone(projects: MockCarouselProject[]): void {
  mockCarouselDone.length = 0;
  mockCarouselDone.push(...projects);
}

export function getProjectDetail(projectSlug: string): MockProjectDetail | null {
  return mockProjectDetails.find(detail => detail.project_slug === projectSlug) ?? null;
}

export function updateProjectDetailBlocks(projectSlug: string, blocks: MockProjectDetailBlock[]): void {
  const detailIndex = mockProjectDetails.findIndex(detail => detail.project_slug === projectSlug);
  if (detailIndex >= 0) {
    mockProjectDetails[detailIndex].blocks = blocks;
  } else {
    mockProjectDetails.push({ project_slug: projectSlug, blocks });
  }
}

// ==========================================
// STAGE 8: USERS & ACCESS MANAGER MOCKS
// ==========================================

export interface MockUser {
  id: string;
  email: string;
  full_name: string;
  hub_role: 'superadmin' | 'member';
  status: 'active' | 'disabled';
  created_at: number;
  last_login_at: number | null;
}

export interface MockUserProjectAccess {
  user_id: string;
  project_slug: string;
  can_view: boolean;
  can_admin: boolean;
}

// Lista de usuarios del sistema
export const mockUsers: MockUser[] = [
  {
    id: '1',
    email: 'ahirane@gmail.com',
    full_name: 'Ahirane',
    hub_role: 'superadmin',
    status: 'active',
    created_at: Date.now() - (1000 * 60 * 60 * 24 * 90), // Hace 90 días
    last_login_at: Date.now() - (1000 * 60 * 30), // Hace 30 minutos
  },
  {
    id: '2',
    email: 'colaborador@hcrsol.com',
    full_name: 'María García',
    hub_role: 'member',
    status: 'active',
    created_at: Date.now() - (1000 * 60 * 60 * 24 * 60), // Hace 60 días
    last_login_at: Date.now() - (1000 * 60 * 60 * 2), // Hace 2 horas
  },
  {
    id: '3',
    email: 'desarrollador@hcrsol.com',
    full_name: 'Juan Pérez',
    hub_role: 'member',
    status: 'active',
    created_at: Date.now() - (1000 * 60 * 60 * 24 * 30), // Hace 30 días
    last_login_at: Date.now() - (1000 * 60 * 60 * 24), // Hace 1 día
  },
  {
    id: '4',
    email: 'cliente@ejemplo.com',
    full_name: 'Ana Martínez',
    hub_role: 'member',
    status: 'active',
    created_at: Date.now() - (1000 * 60 * 60 * 24 * 15), // Hace 15 días
    last_login_at: null, // Nunca ha iniciado sesión
  },
  {
    id: '5',
    email: 'antiguo@hcrsol.com',
    full_name: 'Usuario Deshabilitado',
    hub_role: 'member',
    status: 'disabled',
    created_at: Date.now() - (1000 * 60 * 60 * 24 * 180), // Hace 180 días
    last_login_at: Date.now() - (1000 * 60 * 60 * 24 * 90), // Hace 90 días
  },
];

// Accesos de usuarios a proyectos
export const mockUserProjectAccesses: MockUserProjectAccess[] = [
  // ID '3' (ahiraner@gmail.com) - acceso a whatsapp-reader (view + admin) y powerbi-molino-balmaceda (view only)
  {
    user_id: '3',
    project_slug: 'whatsapp-reader',
    can_view: true,
    can_admin: true,
  },
  {
    user_id: '3',
    project_slug: 'powerbi-molino-balmaceda',
    can_view: true,
    can_admin: false,
  },
];

// Helpers para Users Manager (ACTUALIZADOS para trabajar con mockProfiles)

// NUEVO: Obtener todos los usuarios desde mockProfiles
export function getAllUsers(): MockProfile[] {
  // Retornar mockProfiles como fuente única de verdad
  return mockProfiles;
}

// NUEVO: Obtener usuario por ID desde mockProfiles
export function getUserById(userId: string): MockProfile | null {
  return mockProfiles.find(u => u.id === userId) ?? null;
}

// NUEVO: Crear usuario en mockProfiles (unificado)
export function createUser(data: {
  email: string;
  full_name: string;
  username?: string | null;
  hub_role: 'superadmin' | 'member'
}): MockProfile {
  const newUser: MockProfile = {
    id: Date.now().toString(),
    email: data.email,
    username: data.username ?? null,
    full_name: data.full_name,
    hub_role: data.hub_role,
    status: 'active',
    password_set: false, // Usuario nuevo debe establecer contraseña
    created_at: Date.now(),
    last_login_at: null,
  };

  mockProfiles.push(newUser);
  return newUser;
}

// NUEVO: Actualizar usuario en mockProfiles
export function updateUser(
  userId: string,
  updates: Partial<Pick<MockProfile, 'full_name' | 'username' | 'hub_role' | 'status'>>
): boolean {
  const userIndex = mockProfiles.findIndex(u => u.id === userId);
  if (userIndex >= 0) {
    Object.assign(mockProfiles[userIndex], updates);
    return true;
  }
  return false;
}

// NUEVO: Actualizar perfil de usuario (para que el usuario edite su propio perfil)
export function updateUserProfile(
  userId: string,
  updates: Partial<Pick<MockProfile, 'full_name' | 'username'>>
): boolean {
  const userIndex = mockProfiles.findIndex(u => u.id === userId);
  if (userIndex >= 0) {
    // Validar username único si se está cambiando
    if (updates.username !== undefined && updates.username !== null) {
      const usernameExists = mockProfiles.some(
        u => u.id !== userId && u.username === updates.username
      );
      if (usernameExists) {
        return false; // Username ya existe
      }
    }

    Object.assign(mockProfiles[userIndex], updates);
    return true;
  }
  return false;
}

// NUEVO: Eliminar usuario de mockProfiles
export function deleteUser(userId: string): boolean {
  const index = mockProfiles.findIndex(u => u.id === userId);
  if (index >= 0) {
    mockProfiles.splice(index, 1);

    // Eliminar también sus accesos a proyectos
    const accessesToRemove = mockUserProjectAccesses.filter(a => a.user_id === userId);
    accessesToRemove.forEach(access => {
      const accessIndex = mockUserProjectAccesses.indexOf(access);
      if (accessIndex >= 0) {
        mockUserProjectAccesses.splice(accessIndex, 1);
      }
    });

    return true;
  }
  return false;
}

export function getUserProjectAccesses(userId: string): MockUserProjectAccess[] {
  return mockUserProjectAccesses.filter(a => a.user_id === userId);
}

export function updateUserProjectAccess(
  userId: string,
  projectSlug: string,
  access: { can_view: boolean; can_admin: boolean }
): void {
  const existingIndex = mockUserProjectAccesses.findIndex(
    a => a.user_id === userId && a.project_slug === projectSlug
  );

  if (access.can_view) {
    // Crear o actualizar acceso
    if (existingIndex >= 0) {
      mockUserProjectAccesses[existingIndex] = { user_id: userId, project_slug: projectSlug, ...access };
    } else {
      mockUserProjectAccesses.push({ user_id: userId, project_slug: projectSlug, ...access });
    }
  } else {
    // Eliminar acceso si can_view es false
    if (existingIndex >= 0) {
      mockUserProjectAccesses.splice(existingIndex, 1);
    }
  }
}

export function removeUserProjectAccess(userId: string, projectSlug: string): void {
  const index = mockUserProjectAccesses.findIndex(
    a => a.user_id === userId && a.project_slug === projectSlug
  );
  if (index >= 0) {
    mockUserProjectAccesses.splice(index, 1);
  }
}