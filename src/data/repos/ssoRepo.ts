import { 
  createSsoSession,
  validateSsoSession,
  buildSsoAdminUrl,
  type MockSsoSession,
  type SsoSessionStatus
} from '../mocks';

export const ssoRepo = {
  async createSsoSession(projectSlug: string, userEmail: string): Promise<MockSsoSession> {
    return createSsoSession(projectSlug, userEmail);
  },
  async validateSsoSession(token: string): Promise<{ valid: boolean; reason?: string }> {
    return validateSsoSession(token);
  },
  async buildSsoAdminUrl(adminUrl: string, token: string): Promise<string> {
    return buildSsoAdminUrl(adminUrl, token);
  }
};

export type { MockSsoSession, SsoSessionStatus };
