import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword, signToken, verifyToken, checkRole, authenticateUser } from "../src/lib/auth";

describe("Authentication & RBAC Security Layer", () => {
  it("hashes passwords securely and verifies correctly with bcrypt", async () => {
    const raw = "Admin@123456";
    const hashed = await hashPassword(raw);

    expect(hashed).not.toBe(raw);
    expect(await verifyPassword(raw, hashed)).toBe(true);
    expect(await verifyPassword("WrongPassword", hashed)).toBe(false);
  });

  it("signs and verifies JWT authentication tokens", () => {
    const mockUser = {
      id: "usr-admin-01",
      dealershipId: "northstar-motors-001",
      name: "Vikram Malhotra",
      email: "admin@northstarmotors.in",
      role: "DEALERSHIP_ADMIN" as const,
    };

    const token = signToken(mockUser);
    expect(token).toBeDefined();

    const decoded = verifyToken(token);
    expect(decoded?.email).toBe(mockUser.email);
    expect(decoded?.role).toBe("DEALERSHIP_ADMIN");
  });

  it("enforces strict role checks for RBAC", () => {
    expect(checkRole("DEALERSHIP_ADMIN", ["DEALERSHIP_ADMIN", "SALES_MANAGER"])).toBe(true);
    expect(checkRole("SALES_AGENT", ["DEALERSHIP_ADMIN", "SALES_MANAGER"])).toBe(false);
    expect(checkRole("SUPER_ADMIN", ["DEALERSHIP_ADMIN"])).toBe(true); // Super Admin bypass
  });

  it("authenticates valid demo staff credentials", async () => {
    const user = await authenticateUser("admin@northstarmotors.in", "Admin@123456");
    expect(user).not.toBeNull();
    expect(user?.role).toBe("DEALERSHIP_ADMIN");

    const failed = await authenticateUser("admin@northstarmotors.in", "WrongPass");
    expect(failed).toBeNull();
  });
});
