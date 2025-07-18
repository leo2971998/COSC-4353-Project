import { matchVolunteer } from "../matchController.js";

// Mock volunteers and events data
jest.mock("../../data/volunteers.js", () => ({
  volunteers: [
    {
      id: "1",
      name: "John Doe",
      location: "Houston",
      skills: ["first aid", "cooking"],
      preferences: ["outdoors"],
      availability: {
        start: "2025-07-15T00:00:00Z",
        end: "2025-07-20T23:59:59Z",
      },
    },
  ],
}));

jest.mock("../../data/events.js", () => ({
  events: [
    {
      id: 101,
      name: "Food Drive",
      location: "Houston",
      requiredSkills: ["cooking"],
      preferenceTag: "outdoors",
      startTime: "2025-07-17T10:00:00Z",
      endTime: "2025-07-17T18:00:00Z",
    },
    {
      id: 102,
      name: "Medical Camp",
      location: "Dallas",
      requiredSkills: ["first aid"],
      preferenceTag: "indoors",
      startTime: "2025-07-18T10:00:00Z",
      endTime: "2025-07-18T16:00:00Z",
    },
  ],
}));

describe("matchVolunteer", () => {
  it("should return matched events for a valid volunteer", () => {
    const req = { params: { volunteerId: "1" } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    matchVolunteer(req, res);

    expect(res.json).toHaveBeenCalled();
    const data = res.json.mock.calls[0][0];
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(1);
    expect(data[0].name).toBe("Food Drive");
  });

  it("should return 404 if volunteer not found", () => {
    const req = { params: { volunteerId: "999" } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    matchVolunteer(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Volunteer not found" });
  });
});