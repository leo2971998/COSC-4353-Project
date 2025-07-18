import bcrypt from "bcryptjs";
import {
  validateRegisterInput,
  validateLoginInput,
  validateProfileInput
} from "./validators.js";

export function createServices(repo) {
  return {
    async register(input) {
      const { valid, errors } = validateRegisterInput(input);
      if (!valid) return { ok: false, code: 400, errors };

      const existing = await repo.findUserByEmail(input.email);
      if (existing) return { ok: false, code: 409, errors: { email: "Exists" } };

      const passwordHash = await bcrypt.hash(input.password, 10);
      const userId = await repo.createUser({
        name: input.name,
        email: input.email,
        passwordHash
      });
      return { ok: true, code: 201, userId };
    },

    async login(input) {
      const { valid, errors } = validateLoginInput(input);
      if (!valid) return { ok: false, code: 400, errors };

      const user = await repo.findUserByEmail(input.email);
      if (!user) return { ok: false, code: 401, errors: { creds: "Invalid" } };

      const match = await bcrypt.compare(input.password, user.passwordHash);
      if (!match) return { ok: false, code: 401, errors: { creds: "Invalid" } };

      const profile = await repo.getProfile(user.id);
      const profileComplete = !!profile && profile.is_complete === 1;
      return {
        ok: true,
        code: 200,
        data: { userId: user.id, profileComplete }
      };
    },

    async saveProfile(input) {
      const { valid, errors } = validateProfileInput(input);
      if (!valid) return { ok: false, code: 400, errors };
      await repo.upsertProfile(input.userId, input);
      return { ok: true, code: 200 };
    }
  };
}
