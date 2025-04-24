
export type UserRole = 'admin' | 'test_manager' | 'test_engineer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserInvite {
  id: string;
  email: string;
  role: UserRole;
  status: 'pending' | 'accepted';
  createdAt: Date;
}
