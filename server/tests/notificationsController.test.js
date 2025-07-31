import { jest } from '@jest/globals';
import {
  getAllNotifications,
  getNotificationsByUserId,
  createNotification,
} from '../controllers/notificationsController.js';

describe('Notifications Controller', () => {
  test('getAllNotifications should return an array of notifications', () => {
    const req = {};
    const res = {
      json: jest.fn(),
    };

    getAllNotifications(req, res);

    expect(res.json).toHaveBeenCalled();
    const data = res.json.mock.calls[0][0];
    expect(Array.isArray(data)).toBe(true);
  });

  test('getNotificationsByUserId should return filtered notifications', () => {
    const req = { params: { userId: '1' } };
    const res = {
      json: jest.fn(),
    };

    getNotificationsByUserId(req, res);

    expect(res.json).toHaveBeenCalled();
    const data = res.json.mock.calls[0][0];
    expect(Array.isArray(data)).toBe(true);
    data.forEach((n) => {
      expect(n.userId).toBe(1);
    });
  });

  test('createNotification should add a new notification', () => {
    const req = {
      body: { userId: 2, message: 'Test message' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    createNotification(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
    const data = res.json.mock.calls[0][0];
    expect(data).toHaveProperty('userId', 2);
    expect(data).toHaveProperty('message', 'Test message');
    expect(data).toHaveProperty('read', false);
  });
});