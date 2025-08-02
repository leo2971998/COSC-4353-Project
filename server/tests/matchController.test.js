// tests/matchController.test.js
import { jest } from "@jest/globals";

// Cache-busting dynamic import so each test sees mocks established first
async function freshController() {
  const mod = await import("../controllers/matchController.js?t=" + Date.now());
  return mod;
}

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

afterEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
});

/**
 * 1) Happy path (memory mode)
 * - Mock events & volunteers to guarantee a strong match for volunteer "1"
 * - Provide a mock addNotification export (don’t reassign read-only exports)
 */
test("returns matched events for a valid volunteer (memory mode)", async () => {
  process.env.USE_DB = "0";

  jest.unstable_mockModule("../data/events.js", () => ({
    events: [
      {
        id: "a1",
        title: "Health Camp",
        location: "Houston",
        requiredSkills: ["teaching", "first aid"],
        preferenceTag: "outdoors",
        startTime: "2025-07-18T10:00:00Z",
        endTime: "2025-07-18T14:00:00Z",
      },
    ],
  }));

  const addNotificationMock = jest.fn();
  jest.unstable_mockModule("../controllers/notificationsController.js", () => ({
    addNotification: addNotificationMock,
  }));

  jest.unstable_mockModule("../data/volunteers.js", () => ({
    volunteers: [
      {
        id: "1",
        name: "Alice",
        location: "Houston",
        skills: ["teaching", "first aid"],
        availability: { start: "2025-07-18T09:00:00Z", end: "2025-07-18T17:00:00Z" },
        preferences: ["outdoors"],
      },
    ],
  }));

  const { matchVolunteer } = await freshController();
  const req = { params: { volunteerId: "1" } };
  const res = mockRes();

  await matchVolunteer(req, res);

  expect(res.json).toHaveBeenCalled();
  const data = res.json.mock.calls[0][0];
  expect(Array.isArray(data)).toBe(true);
  expect(data.length).toBeGreaterThan(0);
  expect(data[0].title).toBe("Health Camp");
  expect(addNotificationMock).toHaveBeenCalledTimes(1);
});

/**
 * 2) No-good-matches branch (empty result)
 */
test("returns empty array when there are no good matches", async () => {
  process.env.USE_DB = "0";

  jest.unstable_mockModule("../data/events.js", () => ({
    events: [
      {
        id: "x",
        title: "Far Away",
        location: "Nowhere",
        requiredSkills: ["unrelated"],
        preferenceTag: "indoors",
        startTime: "2030-01-01T10:00:00Z",
        endTime: "2030-01-01T12:00:00Z",
      },
    ],
  }));

  const addNotificationMock = jest.fn();
  jest.unstable_mockModule("../controllers/notificationsController.js", () => ({
    addNotification: addNotificationMock,
  }));

  jest.unstable_mockModule("../data/volunteers.js", () => ({
    volunteers: [
      {
        id: "1",
        name: "Alice",
        location: "Houston",
        skills: ["teaching", "first aid"],
        availability: { start: "2025-07-18T09:00:00Z", end: "2025-07-18T17:00:00Z" },
        preferences: ["outdoors"],
      },
    ],
  }));

  const { matchVolunteer } = await freshController();
  const req = { params: { volunteerId: "1" } };
  const res = mockRes();

  await matchVolunteer(req, res);

  expect(res.json).toHaveBeenCalled();
  const data = res.json.mock.calls[0][0];
  expect(Array.isArray(data)).toBe(true);
  expect(data.length).toBe(0);
  expect(addNotificationMock).not.toHaveBeenCalled();
});

/**
 * 3) Error branch (simulate DB error flow)
 * - Force USE_DB=1 and make db.query throw to hit the catch block
 * - Loosen SQL assertions by normalizing whitespace in string
 */
test("DB mode: creates notification and returns matches (and handles DB error path)", async () => {
  process.env.USE_DB = "1";

  // Successful path first: one successful SELECT + one INSERT
  const queryMock = jest
    .fn()
    // First call: SELECT volunteer
    .mockResolvedValueOnce([
      [
        {
          id: 1,
          location: "Houston",
          skills: "teaching, first aid",
          preferences: "outdoors",
          availability_start: "2025-07-18T09:00:00Z",
          availability_end: "2025-07-18T17:00:00Z",
        },
      ],
    ])
    // Second call: INSERT notification
    .mockResolvedValueOnce([{ affectedRows: 1 }]);

  jest.unstable_mockModule("../db.js", () => ({ default: { query: queryMock } }));

  // Events data to produce a strong match
  jest.unstable_mockModule("../data/events.js", () => ({
    events: [
      {
        id: "a1",
        title: "Health Camp",
        location: "Houston",
        requiredSkills: ["teaching", "first aid"],
        preferenceTag: "outdoors",
        startTime: "2025-07-18T10:00:00Z",
        endTime: "2025-07-18T14:00:00Z",
      },
    ],
  }));

  // Provide a stub for notifications module (not used directly in DB path)
  jest.unstable_mockModule("../controllers/notificationsController.js", () => ({
    addNotification: jest.fn(),
  }));

  const { matchVolunteer } = await freshController();
  const req = { params: { volunteerId: "1" } };
  const res = mockRes();

  await matchVolunteer(req, res);

  // Normalize whitespace before comparing SQL (handles newlines/extra spaces)
  const norm = (s) => s.replace(/\s+/g, " ").trim();

  expect(norm(queryMock.mock.calls[0][0])).toBe(
    "SELECT id, location, skills, preferences, availability_start, availability_end FROM volunteers WHERE id = ?"
  );
  expect(queryMock.mock.calls[0][1]).toEqual(["1"]);

  expect(queryMock.mock.calls[1][0]).toContain(
    "INSERT INTO notifications (userId, message, is_read)"
  );
  expect(queryMock.mock.calls[1][1]).toEqual([1, "You've been matched to Health Camp!", false]);

  // Now simulate an error to hit the catch block
  jest.resetModules(); // reset mocks between import cycles
  const failingQuery = jest.fn().mockRejectedValue(new Error("db boom"));
  jest.unstable_mockModule("../db.js", () => ({ default: { query: failingQuery } }));
  jest.unstable_mockModule("../controllers/notificationsController.js", () => ({
    addNotification: jest.fn(),
  }));
  jest.unstable_mockModule("../data/events.js", () => ({ events: [] }));

  const { matchVolunteer: matchVolunteerFail } = await freshController();
  const res2 = mockRes();
  await matchVolunteerFail(req, res2);

  expect(res2.status).toHaveBeenCalledWith(500);
  expect(res2.json).toHaveBeenCalledWith({ message: "Server error" });
});