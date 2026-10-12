import NextAuth from "next-auth";
import { UserRole } from "./user";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      token: string;
      name?: string;
      email?: string;
      role: UserRole;
      mustChangePassword: boolean;
    };
  }
}
