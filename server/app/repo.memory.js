let nextId = 1;

const users = new Map();
const emailIndex = new Map();
const profiles = new Map();

export function resetRepo() {
  nextId = 1;
  users.clear();
  emailIndex.clear();
  profiles.clear();
}

export async function findUserByEmail(email) {
  const id = emailIndex.get(email);
  return id ? users.get(id) : null;
}

export async function createUser({ name, email, passwordHash }) {
  if (emailIndex.has(email)) throw new Error("DUP_EMAIL");
  const id = nextId++;
  users.set(id, { id, name, email, passwordHash, role: "user" });
  emailIndex.set(email, id);
  profiles.set(id, { user_id: id, is_complete: 0 });
  return id;
}

export async function getProfile(userId) {
  return profiles.get(userId) || null;
}

export async function upsertProfile(userId, data) {
  const existing = profiles.get(userId) || { user_id: userId, is_complete: 0 };
  profiles.set(userId, { ...existing, ...data, is_complete: 1 });
}

export async function listUsers() {
  return Array.from(users.values()).map(({ id, name, email, role }) => ({
    id,
    name,
    email,
    role
  }));
}

export async function updateUserRole(userId, role) {
  const u = users.get(userId);
  if (u) u.role = role;
}

export async function updateUserPassword(userId, passwordHash) {
  const u = users.get(userId);
  if (u) u.passwordHash = passwordHash;
}