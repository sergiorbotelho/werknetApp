export type UserRole = "ADMIN" | "BASICO";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  mustChangePassword: boolean;
  avatarUpdatedAt: string | null;
  created_at: string;
}

export const roleLabels: Record<UserRole, string> = {
  ADMIN: "Admin",
  BASICO: "Básico",
};
