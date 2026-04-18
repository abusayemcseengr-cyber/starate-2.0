export type Role = 'USER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar?: string | null;
  role: Role;
  createdAt: Date;
}
