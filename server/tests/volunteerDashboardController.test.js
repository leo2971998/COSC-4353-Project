import { jest } from '@jest/globals';

jest.unstable_mockModule('../db.js', () => ({
    query: jest.fn(),
}));

const { getNextEvent } = await import('../controllers/volunteerDashboardController.js');
const { query } = await import('../db.js');

describe('getNextEvent', () => {
    beforeEach(() => {
        query.mockReset();
    });

    test('returns the next event for a volunteer', async () => {
        const mockEvent = [{ event_id: 1 }];
        query.mockResolvedValue(mockEvent);

        const req = { params: { userID: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await getNextEvent(req, res);

        expect(query).toHaveBeenCalledWith(expect.any(String), [1]);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ next_event: mockEvent });
    });

    test('handles database errors', async () => {
        query.mockRejectedValue(new Error('db error'));

        const req = { params: { userID: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await getNextEvent(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Server error fetching volunteer's next event",
        });
    });
});