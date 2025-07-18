import {
  resetRepo,
  createUser,
  findUserByEmail,
  updateUserRole,
  updateUserPassword,
  listUsers,
  getProfile
} from "../app/repo.memory.js";
import bcrypt from "bcryptjs";

describe("repo.memory extra coverage", () => {
  beforeEach(() => resetRepo());

  test("updateUserRole and listUsers reflect change", async () => {
    const id = await createUser({ name: "RoleUser", email: "role@e.com", passwordHash: "h" });
    await updateUserRole(id, "admin");
    const list = await listUsers();
    expect(list).toContainEqual(expect.objectContaining({ id, role: "admin" }));
  });

  test("updateUserPassword changes stored hash", async () => {
    const id = await createUser({ name: "PwUser", email: "pw@e.com", passwordHash: "old" });
    const newHash = await bcrypt.hash("NewPass123", 4);
    await updateUserPassword(id, newHash);
    const u = await findUserByEmail("pw@e.com");
    expect(u.passwordHash).toBe(newHash);
  });

  test("updateUserRole / updateUserPassword on non-existent user are no-ops (branch hit)", async () => {
    // Call with id that does not exist to cover early return branch
    await updateUserRole(999, "admin");
    await updateUserPassword(999, "hashX");
    // repo should still be empty
    expect(listUsers()).resolves.toHaveLength(0);
  });

  test("getProfile returns null for unknown user (branch)", async () => {
    const prof = await getProfile(12345);
    expect(prof).toBeNull();
  });
});
