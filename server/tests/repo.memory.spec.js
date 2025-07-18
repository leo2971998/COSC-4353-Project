import * as repo from '../app/repo.memory.js';

describe('repo.memory', () => {
  beforeEach(() => repo.resetRepo());

  test('createUser and findUserByEmail', async () => {
    const id = await repo.createUser({ name: 'A', email: 'a@b.com', passwordHash: 'h' });
    const u = await repo.findUserByEmail('a@b.com');
    expect(u.id).toBe(id);
    expect(u.email).toBe('a@b.com');
  });

  test('duplicate email throws', async () => {
    await repo.createUser({ name: 'A', email: 'a@b.com', passwordHash: 'h' });
    await expect(repo.createUser({ name: 'B', email: 'a@b.com', passwordHash: 'h2' })).rejects.toThrow('DUP_EMAIL');
  });

  test('upsertProfile sets is_complete', async () => {
    const id = await repo.createUser({ name: 'A', email: 'a@b.com', passwordHash: 'h' });
    await repo.upsertProfile(id, { city: 'X' });
    const prof = await repo.getProfile(id);
    expect(prof.city).toBe('X');
    expect(prof.is_complete).toBe(1);
  });
});
