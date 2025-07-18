import { createEvent, events, resetEvents } from "../eventController.js";

describe("createEvent", () => {
  beforeEach(() => {
    resetEvents();  // ensure clean slate before each test
  });

  test("should add a new event to the events array", () => {
    const eventData = { eventName: "Birthday Party" };
    createEvent(eventData);

    expect(events.length).toBe(1);
    expect(events[0]).toEqual(eventData);
  });

  test("should return the created event data", () => {
    const eventData = { eventName: "Graduation" };
    const result = createEvent(eventData);

    expect(result).toEqual(eventData);
  });
});