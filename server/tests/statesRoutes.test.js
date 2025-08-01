import request from 'supertest';
import express from 'express';
import statesRoutes from '../routes/statesRoutes.js';
import db from '../db.js';

jest.mock('../db.js');

const app = express();
app.use('/states', statesRoutes);

describe('GET /states', () => {
  test('returns list of states', async () => {
    db.query.mockResolvedValue([[{ code: 'TX', name: 'Texas' }]]);
    const res = await request(app).get('/states');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([{ code: 'TX', name: 'Texas' }]);
  });

  test('db error returns 500', async () => {
    db.query.mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/states');
    expect(res.statusCode).toBe(500);
  });
});
