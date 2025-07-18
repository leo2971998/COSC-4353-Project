import bcrypt from 'bcryptjs';
import { createServices } from '../app/services.js';
import * as repoMemory from '../app/repo.memory.js';

function freshServices() {
  repoMemory.resetRepo();
  return createServices(repoMemory);
}

describe('services.register', () => {
  test('validation failure', async () => {
    const svc = freshServices();
    const res = await svc.register({ name: '', email: 'bad', password: '1' });
    expect(res.ok).toBe(false);
    expect(res.code).toBe(400);
  });

  test('success + password hashed', async () => {
    const svc = freshServices();
    const res = await svc.register({ name: 'User', email: 'u@e.com', password: 'Secret1' });
    expect(res.ok).toBe(true);
    const user = await repoMemory.findUserByEmail('u@e.com');
    expect(user.passwordHash).not.toBe('Secret1');
    expect(await bcrypt.compare('Secret1', user.passwordHash)).toBe(true);
  });

  test('duplicate email', async () => {
    const svc = freshServices();
    await svc.register({ name: 'User', email: 'dup@e.com', password: 'Secret1' });
    const dup = await svc.register({ name: 'User2', email: 'dup@e.com', password: 'Secret2' });
    expect(dup.ok).toBe(false);
    expect(dup.code).toBe(409);
  });
});

describe('services.login', () => {
  test('unknown email', async () => {
    const svc = freshServices();
    const res = await svc.login({ email: 'none@e.com', password: 'x' });
    expect(res.ok).toBe(false);
    expect(res.code).toBe(401);
  });

  test('bad password', async () => {
    const svc = freshServices();
    await svc.register({ name: 'User', email: 'a@b.com', password: 'Secret1' });
    const res = await svc.login({ email: 'a@b.com', password: 'Wrong!' });
    expect(res.ok).toBe(false);
    expect(res.code).toBe(401);
  });

  test('success profile incomplete', async () => {
    const svc = freshServices();
    await svc.register({ name: 'User', email: 'a@b.com', password: 'Secret1' });
    const res = await svc.login({ email: 'a@b.com', password: 'Secret1' });
    expect(res.ok).toBe(true);
    expect(res.data.profileComplete).toBe(false);
  });

  test('success profile complete', async () => {
    const svc = freshServices();
    await svc.register({ name: 'Comp', email: 'c@b.com', password: 'Secret1' });
    const user = await repoMemory.findUserByEmail('c@b.com');
    await repoMemory.upsertProfile(user.id, { is_complete: 1 });
    const res = await svc.login({ email: 'c@b.com', password: 'Secret1' });
    expect(res.ok).toBe(true);
    expect(res.data.profileComplete).toBe(true);
  });
});
