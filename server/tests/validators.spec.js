import {
  validateRegisterInput,
  validateLoginInput,
  validateProfileInput
} from '../app/validators.js';

describe('validateRegisterInput', () => {
  test('fails missing name', () => {
    const r = validateRegisterInput({ name: '', email: 'a@b.com', password: 'secret1' });
    expect(r.valid).toBe(false);
    expect(r.errors.name).toBeDefined();
  });

  test('fails invalid email', () => {
    const r = validateRegisterInput({ name: 'A', email: 'bad', password: 'secret1' });
    expect(r.valid).toBe(false);
    expect(r.errors.email).toBe('Email invalid');
  });

  test('fails short password', () => {
    const r = validateRegisterInput({ name: 'A', email: 'a@b.com', password: '123' });
    expect(r.valid).toBe(false);
    expect(r.errors.password).toBeDefined();
  });

  test('passes valid', () => {
    const r = validateRegisterInput({ name: 'Alpha', email: 'x@y.com', password: 'Secret1' });
    expect(r.valid).toBe(true);
    expect(r.errors).toEqual({});
  });
});

describe('validateLoginInput', () => {
  test('invalid email + missing password', () => {
    const r = validateLoginInput({ email: 'x', password: '' });
    expect(r.valid).toBe(false);
    expect(r.errors.email).toBeDefined();
    expect(r.errors.password).toBeDefined();
  });
});

describe('validateProfileInput', () => {
  test('missing userId', () => {
    const r = validateProfileInput({ address1: 'A' });
    expect(r.valid).toBe(false);
    expect(r.errors.userId).toBeDefined();
  });

  test('over length address1', () => {
    const r = validateProfileInput({ userId: 1, address1: 'a'.repeat(101) });
    expect(r.valid).toBe(false);
    expect(r.errors.address1).toBeDefined();
  });

  test('valid minimal', () => {
    const r = validateProfileInput({ userId: 1 });
    expect(r.valid).toBe(true);
  });
});
