import { 
  getAllHubProjects,
  getUserProjects,
  mockProjects,
  MOCK_PROJECTS,
  PROJECT_COPY,
  type MockProject,
  type ProjectStatus,
  type SsoMode,
  type HubRole
} from '../mocks';

export const projectsRepo = {
  async getAllHubProjects(): Promise<MockProject[]> { return getAllHubProjects(); },
  async getUserProjects(email: string, role: HubRole): Promise<MockProject[]> { return getUserProjects(email, role); },
  async getMockProjects(): Promise<MockProject[]> { return mockProjects; },
  async getPublicProjects(): Promise<any[]> { return MOCK_PROJECTS; },
  async getProjectCopy(): Promise<Record<string, { short: string; long: string }>> { return PROJECT_COPY; },

  // Sync fallbacks for UI rendering
  getAllHubProjectsSync(): MockProject[] { return getAllHubProjects(); },
  getMockProjectsSync(): MockProject[] { return mockProjects; },
  getPublicProjectsSync(): any[] { return MOCK_PROJECTS; },
  getProjectCopySync(): Record<string, { short: string; long: string }> { return PROJECT_COPY; }
};

export type { MockProject, ProjectStatus, SsoMode };
