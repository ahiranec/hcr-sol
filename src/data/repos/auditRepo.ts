import { mockAuditLog, type MockAuditLog } from '../mocks';

export const auditRepo = {
  async getAuditLogs(): Promise<MockAuditLog[]> { return mockAuditLog; },
  getAuditLogsSync(): MockAuditLog[] { return mockAuditLog; }
};

export type { MockAuditLog };
