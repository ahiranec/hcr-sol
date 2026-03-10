import { 
  getCurrentUser as mockGetCurrentUser, 
  mockLogin, 
  mockSendMagicLink, 
  mockLogout,
  mockAuthState,
  mockUiState,
  type MockProfile,
  type HubRole,
  type UserStatus
} from '../mocks';

export const authRepo = {
  // Async versions represent the future Supabase API
  async getCurrentUser(): Promise<MockProfile | null> { return mockGetCurrentUser(); },
  async login(email: string, password?: string): Promise<boolean> { return mockLogin(email, password || ''); },
  async sendMagicLink(email: string): Promise<boolean> { return mockSendMagicLink(email); },
  async logout(): Promise<void> { return mockLogout(); },
  
  // Sync versions maintain current UI behaviour without huge refactors
  getCurrentUserSync(): MockProfile | null { return mockGetCurrentUser(); },
  getAuthState() { return mockAuthState; },
  getUiState() { return mockUiState; }
};

export type { MockProfile, HubRole, UserStatus };
