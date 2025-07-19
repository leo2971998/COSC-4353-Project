import { createServices } from '../app/services.js';
import * as repo from '../app/repo.memory.js';

describe('services.saveProfile', () => {
  beforeEach(() => repo.resetRepo());

  test('validation fail (missing userId)', async () => {
    const svc = createServices(repo);
    const res = await svc.saveProfile({ city: 'X' });
    expect(res.ok).toBe(false);
    expect(res.code).toBe(400);
    expect(res.errors.userId).toBeDefined();
  });

  test('success', async () => {
    const svc = createServices(repo);
    await svc.register({ name: 'U', email: 'u@e.com', password: 'Secret1' });
    const user = await repo.findUserByEmail('u@e.com');
    const res = await svc.saveProfile({ userId: user.id, city: 'Houston' });
    expect(res.ok).toBe(true);
  });
});
