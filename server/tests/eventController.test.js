import { jest } from '@jest/globals';

jest.unstable_mockModule('../db.js', () => ({
  query: jest.fn(),
}));

const { createEvent, events, resetEvents, getEvents } = await import('../controllers/eventController.js');
const { query } = await import('../db.js');

describe('createEvent', () => {
  beforeEach(() => {
    resetEvents();
  });

  test('should add and return new event', () => {
    const eventData = { eventName: 'Birthday Party' };
    const result = createEvent(eventData);
    expect(result).toEqual(eventData);
  });
});

describe('getEvents', () => {
  test('returns events from database', async () => {
    query.mockResolvedValue([{ event_id: 1 }]);
    const req = {};
    const res = { json: jest.fn() };
    await getEvents(req, res);
    expect(query).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ events: [{ event_id: 1 }] });
  });

  test('handles errors', async () => {
    query.mockRejectedValue(new Error('fail'));
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await getEvents(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
