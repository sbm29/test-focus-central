
export interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  progress: number;
  testCaseCount: number;
  passRate: number;
  createdAt: Date;
  updatedAt: Date;
}
