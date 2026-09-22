export interface AdminUser {
  username: string;
  name: string;
  role: 'super_admin' | 'election_officer' | 'verifier';
  designation: string;
  avatarUrl?: string;
  lastLogin: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AdminUser | null;
}
