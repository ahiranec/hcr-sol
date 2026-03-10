import { 
  canAccessSuperadminTab,
  canEditHome,
  canEditHubProjects,
  canManageUsersAndAccess,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserProfile,
  deleteUser,
  type MockProfile,
  type MockUser
} from '../mocks';

export const profilesRepo = {
  async canAccessSuperadminTab(user: MockProfile | null): Promise<boolean> { return canAccessSuperadminTab(user); },
  async canEditHome(user: MockProfile | null): Promise<boolean> { return canEditHome(user); },
  async canEditHubProjects(user: MockProfile | null): Promise<boolean> { return canEditHubProjects(user); },
  async canManageUsersAndAccess(user: MockProfile | null): Promise<boolean> { return canManageUsersAndAccess(user); },
  async getAllUsers(): Promise<MockProfile[]> { return getAllUsers(); },
  async getUserById(id: string): Promise<MockProfile | null> { return getUserById(id); },
  
  // Sync fallback
  canAccessSuperadminTabSync(user: MockProfile | null): boolean { return canAccessSuperadminTab(user); },
  getAllUsersSync(): MockProfile[] { return getAllUsers(); },
  getUserByIdSync(id: string): MockProfile | null { return getUserById(id); },
  
  async createUser(data: {
    email: string;
    full_name: string;
    username?: string | null;
    hub_role: 'superadmin' | 'member';
  }): Promise<MockProfile> {
    return createUser(data);
  },
  async updateUser(
    id: string, 
    updates: Partial<Pick<MockProfile, 'full_name' | 'username' | 'hub_role' | 'status'>>
  ): Promise<boolean> {
    return updateUser(id, updates);
  },
  async updateUserProfile(
    id: string, 
    updates: Partial<Pick<MockProfile, 'full_name' | 'username'>>
  ): Promise<boolean> {
    return updateUserProfile(id, updates);
  },
  async deleteUser(id: string): Promise<boolean> {
    return deleteUser(id);
  }
};

export type { MockProfile, MockUser };
