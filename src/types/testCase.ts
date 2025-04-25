
export interface TestCase {
  id: string;
  projectId: string;
  moduleId: string;
  testSuiteId: string;
  title: string;
  description: string;
  priority: string;
  type: string;
  preconditions?: string;
  steps: string;
  expectedResults: string;
  status?: string;
  actualResults?: string;
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

export interface Module {
  id: string;
  name: string;
  description?: string;
  projectId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TestSuite {
  id: string;
  name: string;
  description?: string;
  moduleId: string;
  projectId: string;
  createdAt?: Date;
  updatedAt?: Date;
}
