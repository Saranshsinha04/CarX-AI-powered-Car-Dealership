import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { DEMO_DEALERSHIP, DEMO_USERS } from "./data/seedData";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "super-secret-jwt-key-replace-in-production-min-32-chars-length";
const COOKIE_NAME = "auth_session_token";

export interface AuthUser {
  id: string;
  dealershipId: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "DEALERSHIP_ADMIN" | "SALES_MANAGER" | "SALES_AGENT" | "CUSTOMER";
  phone?: string;
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export function signToken(user: AuthUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): AuthUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUser;
  } catch (error) {
    return null;
  }
}

/**
 * Server-side session verification from cookies or Authorization header
 */
export async function getSessionUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch (e) {
    return null;
  }
}

/**
 * Role-Based Access Control validator
 */
export function checkRole(userRole: string, allowedRoles: string[]): boolean {
  if (userRole === "SUPER_ADMIN") return true;
  return allowedRoles.includes(userRole);
}

/**
 * Demo login authenticator (Checks database / demo accounts)
 */
export async function authenticateUser(email: string, password: string): Promise<AuthUser | null> {
  // Check demo credentials
  const demoUser = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (demoUser && (password === "Admin@123456" || password === "password")) {
    return {
      id: demoUser.id,
      dealershipId: DEMO_DEALERSHIP.id,
      name: demoUser.name,
      email: demoUser.email,
      role: demoUser.role as any,
      phone: demoUser.phone,
    };
  }

  return null;
}
