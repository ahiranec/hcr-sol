import { 
  canUserAccessProject,
  canUserAdminProject,
  hasProjectAccess,
  getUserProjectAccesses,
  updateUserProjectAccess,
  removeUserProjectAccess,
  type HubRole,
  type MockProfile,
  type MockUserProjectAccess
} from '../mocks';

export const accessesRepo = {
  async canUserAccessProject(email: string, role: HubRole, projectSlug: string): Promise<boolean> { return canUserAccessProject(email, role, projectSlug); },
  async canUserAdminProject(email: string, role: HubRole, projectSlug: string): Promise<boolean> { return canUserAdminProject(email, role, projectSlug); },
  async hasProjectAccess(user: MockProfile | null, projectSlug: string): Promise<boolean> { return hasProjectAccess(user, projectSlug); },
  async getUserProjectAccesses(userId: string): Promise<MockUserProjectAccess[]> { return getUserProjectAccesses(userId); },
  
  // Sync fallbacks for UI rendering
  canUserAccessProjectSync(email: string, role: HubRole, projectSlug: string): boolean { return canUserAccessProject(email, role, projectSlug); },
  canUserAdminProjectSync(email: string, role: HubRole, projectSlug: string): boolean { return canUserAdminProject(email, role, projectSlug); },
  hasProjectAccessSync(user: MockProfile | null, projectSlug: string): boolean { return hasProjectAccess(user, projectSlug); },
  getUserProjectAccessesSync(userId: string): MockUserProjectAccess[] { return getUserProjectAccesses(userId); },

  async updateUserProjectAccess(userId: string, projectSlug: string, access: { can_view: boolean; can_admin: boolean }): Promise<void> {
    updateUserProjectAccess(userId, projectSlug, access);
  },
  async removeUserProjectAccess(userId: string, projectSlug: string): Promise<void> {
    removeUserProjectAccess(userId, projectSlug);
  }
};

export type { MockUserProjectAccess };
