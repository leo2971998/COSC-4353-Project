console.log("[validators.js] userId check test:", (function() {
  const userId = -1;
  return typeof userId !== "number" || !Number.isInteger(userId) || userId <= 0;
})());
export function isValidEmail(email) {
  return typeof email === "string" &&
         email.length <= 255 &&
         /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateRegisterInput({ name, email, password }) {
  const errors = {};
  if (typeof name !== "string" || !name.trim() || name.length > 255)
    errors.name = "Name invalid";
  if (!isValidEmail(email)) errors.email = "Email invalid";
  if (typeof password !== "string" || password.length < 6 || password.length > 255)
    errors.password = "Password invalid";
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateLoginInput({ email, password }) {
  const errors = {};
  if (!isValidEmail(email)) errors.email = "Email invalid";
  if (typeof password !== "string" || !password) errors.password = "Password required";
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateProfileInput(data) {
  const {
    userId, address1, address2, city, state, zipCode,
    skills, preferences, availability
  } = data;
  const errors = {};
  console.log("[validateProfileInput] received userId:", userId, "isInt?", Number.isInteger(userId));

  if (
      typeof userId !== "number" ||
      !Number.isInteger(userId) ||
      userId <= 0
  ) {
    console.log("[validateProfileInput] marking userId invalid for value:", userId);
    errors.userId = "userId required";
  }
  const str = (v) => v == null || typeof v === "string";

  if (!str(address1) || (address1 && address1.length > 100)) errors.address1 = "address1 invalid";
  if (!str(address2) || (address2 && address2.length > 100)) errors.address2 = "address2 invalid";
  if (!str(city)     || (city && city.length > 100)) errors.city = "city invalid";
  if (!str(state)    || (state && state.length > 50)) errors.state = "state invalid";
  if (!str(zipCode)  || (zipCode && zipCode.length > 10)) errors.zipCode = "zip invalid";
  if (!str(skills)   || (skills && skills.length > 255)) errors.skills = "skills invalid";
  if (!str(preferences) || (preferences && preferences.length > 1000)) errors.preferences = "preferences invalid";
  if (!str(availability) || (availability && availability.length > 255)) errors.availability = "availability invalid";

  return { valid: Object.keys(errors).length === 0, errors };
}
