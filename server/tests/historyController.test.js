// tests/historyController.test.js
import { jest } from "@jest/globals";

// Mock DB before importing controller
jest.unstable_mockModule("../db.js", () => ({
  query: jest.fn(),
}));

// Dynamic imports AFTER mock
const { getVolunteerHistoryParams } = await import(
  "../controllers/historyController.js"
);
const { query } = await import("../db.js");

test("should return volunteer history for a user", async () => {
  const mockData = [
    { history_id: 1, event_name: "Food Drive", skills: "packing" },
  ];
  query.mockResolvedValueOnce(mockData);

  const req = { params: { userID: "123" } };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  await getVolunteerHistoryParams(req, res);

  expect(query).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({ volunteer_history: mockData });
});
