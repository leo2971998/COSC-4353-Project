import { jest } from '@jest/globals';
import { matchVolunteer } from "../controllers/matchController.js";
import { volunteers } from "../data/volunteers.js";
import { events } from "../data/events.js";

// Create a mock for req and res
function mockResponse() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

test("should return matched events for a valid volunteer", () => {
  const req = { params: { volunteerId: "1" } };
  const res = mockResponse();

  matchVolunteer(req, res);

  // Should respond with at least 1 match
  expect(res.json).toHaveBeenCalled();
  const matched = res.json.mock.calls[0][0];
  expect(matched.length).toBeGreaterThan(0);
});