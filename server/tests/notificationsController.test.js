// tests/notificationsController.test.js
import { jest } from "@jest/globals";

const makeRes = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe("notificationsController — MOCK mode", () => {
  let getAllNotifications, getNotificationsByUserId, createNotification;

  beforeEach(async () => {
    delete process.env.USE_DB;
    jest.resetModules();

    const mod = await import("../controllers/notificationsController.js");
    ({ getAllNotifications, getNotificationsByUserId, createNotification } =
      mod);
  });

  afterEach(() => jest.clearAllMocks());

  test("getAllNotifications returns array", () => {
    const res = makeRes();
    getAllNotifications({}, res);
    expect(res.json).toHaveBeenCalled();
    expect(Array.isArray(res.json.mock.calls[0][0])).toBe(true);
  });

  test("getNotificationsByUserId filters by id", () => {
    const res = makeRes();
    getNotificationsByUserId({ params: { userId: "1" } }, res);
    const rows = res.json.mock.calls[0][0];
    expect(Array.isArray(rows)).toBe(true);
    rows.forEach((r) => expect(r.userId).toBe(1));
  });

  test("createNotification adds and returns 201", () => {
    const res = makeRes();
    createNotification({ body: { userId: 2, message: "Test message" } }, res);
    expect(res.status).toHaveBeenCalledWith(201);
    const n = res.json.mock.calls[0][0];
    expect(n).toMatchObject({ userId: 2, message: "Test message", read: false });
  });

  test("createNotification 400 on missing fields", () => {
    const res = makeRes();
    createNotification({ body: { userId: null, message: "" } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe("notificationsController — DB mode", () => {
  let db, getAllNotifications, getNotificationsByUserId, createNotification;

  beforeEach(async () => {
    process.env.USE_DB = "1";
    jest.resetModules();

    db = (await import("../db.js")).default;
    jest.spyOn(db, "query").mockReset();

    const mod = await import("../controllers/notificationsController.js");
    ({ getAllNotifications, getNotificationsByUserId, createNotification } =
      mod);
  });

  afterEach(() => {
    delete process.env.USE_DB;
    jest.clearAllMocks();
  });

  test("getAllNotifications returns DB rows", async () => {
    db.query.mockResolvedValueOnce([
      [{ id: 1, userId: 1, message: "SQL row", is_read: 0 }],
    ]);
    const res = makeRes();
    await getAllNotifications({}, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ message: "SQL row" })])
    );
  });

  test("getNotificationsByUserId queries with id", async () => {
    db.query.mockResolvedValueOnce([
      [
        { id: 10, userId: 9, message: "A", is_read: 0 },
        { id: 11, userId: 9, message: "B", is_read: 1 },
      ],
    ]);
    const res = makeRes();
    await getNotificationsByUserId({ params: { userId: "9" } }, res);
    expect(db.query).toHaveBeenCalledWith(
      expect.stringMatching(/where userId = \?/i),
      [9]
    );
    const rows = res.json.mock.calls[0][0];
    expect(rows).toHaveLength(2);
  });

  test("createNotification inserts row (DB)", async () => {
    db.query.mockResolvedValueOnce([{ insertId: 123 }]);
    const res = makeRes();
    await createNotification(
      { body: { userId: 5, message: "New DB notif" } },
      res
    );
    expect(db.query).toHaveBeenCalledWith(
      expect.stringMatching(/insert into notifications/i),
      [5, "New DB notif", 0]
    );
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("DB error → 500", async () => {
    db.query.mockRejectedValueOnce(new Error("db-down"));
    const res = makeRes();
    await getAllNotifications({}, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
  });
});