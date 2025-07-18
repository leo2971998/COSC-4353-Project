import {
  validateRegisterInput,
  validateLoginInput,
  validateProfileInput,
  isValidEmail
} from "../app/validators.js";

describe("isValidEmail", () => {
  test("rejects empty string", () => {
    expect(isValidEmail("")).toBe(false);
  });

  test("rejects >255 length email", () => {
    const local = "a".repeat(250);
    const longEmail = `${local}@x.com`;
    expect(longEmail.length).toBeGreaterThan(255);
    expect(isValidEmail(longEmail)).toBe(false);
  });

  test("accepts normal email", () => {
    expect(isValidEmail("user@test.com")).toBe(true);
  });
});

describe("validateRegisterInput", () => {
  test("missing name", () => {
    const r = validateRegisterInput({ name: "", email: "a@b.com", password: "secret1" });
    expect(r.valid).toBe(false);
    expect(r.errors.name).toBeDefined();
  });

  test("name >255 chars", () => {
    const r = validateRegisterInput({
      name: "x".repeat(256),
      email: "a@b.com",
      password: "secret1"
    });
    expect(r.valid).toBe(false);
    expect(r.errors.name).toBeDefined();
  });

  test("invalid email", () => {
    const r = validateRegisterInput({ name: "A", email: "bad", password: "secret1" });
    expect(r.valid).toBe(false);
    expect(r.errors.email).toBe("Email invalid");
  });

  test("short password", () => {
    const r = validateRegisterInput({ name: "A", email: "a@b.com", password: "123" });
    expect(r.valid).toBe(false);
    expect(r.errors.password).toBeDefined();
  });

  test("password >255 chars", () => {
    const r = validateRegisterInput({
      name: "A",
      email: "a@b.com",
      password: "p".repeat(256)
    });
    expect(r.valid).toBe(false);
    expect(r.errors.password).toBeDefined();
  });

  test("valid payload", () => {
    const r = validateRegisterInput({ name: "Alpha", email: "x@y.com", password: "Secret1" });
    expect(r.valid).toBe(true);
    expect(r.errors).toEqual({});
  });
});

describe("validateLoginInput", () => {
  test("invalid email + empty password", () => {
    const r = validateLoginInput({ email: "x", password: "" });
    expect(r.valid).toBe(false);
    expect(r.errors.email).toBeDefined();
    expect(r.errors.password).toBeDefined();
  });

  test("valid login", () => {
    const r = validateLoginInput({ email: "ok@test.io", password: "pass123" });
    expect(r.valid).toBe(true);
  });
});

describe("validateProfileInput", () => {
  test("missing userId", () => {
    const r = validateProfileInput({ city: "A" });
    expect(r.valid).toBe(false);
    expect(r.errors.userId).toBeDefined();
  });

  test("invalid userId (negative)", () => {
    const r = validateProfileInput({ userId: -1 });
    expect(r.valid).toBe(false);
    expect(r.errors.userId).toBeDefined();
  });

  test("address1 over length", () => {
    const r = validateProfileInput({ userId: 1, address1: "a".repeat(101) });
    expect(r.valid).toBe(false);
    expect(r.errors.address1).toBeDefined();
  });

  test("zipCode >10 chars", () => {
    const r = validateProfileInput({ userId: 1, zipCode: "1".repeat(11) });
    expect(r.valid).toBe(false);
    expect(r.errors.zipCode).toBeDefined();
  });

  test("skills >255 chars", () => {
    const r = validateProfileInput({ userId: 1, skills: "s".repeat(256) });
    expect(r.valid).toBe(false);
    expect(r.errors.skills).toBeDefined();
  });

  test("preferences >1000 chars", () => {
    const r = validateProfileInput({ userId: 1, preferences: "p".repeat(1001) });
    expect(r.valid).toBe(false);
    expect(r.errors.preferences).toBeDefined();
  });

  test("availability >255 chars", () => {
    const r = validateProfileInput({ userId: 1, availability: "a".repeat(256) });
    expect(r.valid).toBe(false);
    expect(r.errors.availability).toBeDefined();
  });

  test("boundary max lengths are valid", () => {
    const r = validateProfileInput({
      userId: 1,
      zipCode: "1".repeat(10),
      skills: "s".repeat(255),
      preferences: "p".repeat(1000),
      availability: "a".repeat(255)
    });
    expect(r.valid).toBe(true);
  });

  test("valid minimal", () => {
    const r = validateProfileInput({ userId: 1 });
    expect(r.valid).toBe(true);
  });
});
