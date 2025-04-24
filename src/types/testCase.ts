
export interface TestCase {
  id: string;
  projectId: string;
  title: string;
  description: string;
  priority: string;
  type: string;
  preconditions?: string;
  steps: string;
  expectedResults: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TestExecution {
  id: string;
  testCaseId: string;
  status: 'Passed' | 'Failed' | 'Blocked' | 'Not Executed';
  actualResults: string;
  notes?: string;
  executedBy: string;
  executedAt: Date;
}
