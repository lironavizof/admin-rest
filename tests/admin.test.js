const request = require('supertest');

//  mock the logger so it won't try to send logs during tests
jest.mock('../middleware/logger', () => (req, res, next) => next());

const app = require('../app');

describe('Admin service', () => {
    test('GET /api/about should return team members', async () => {
        const res = await request(app).get('/api/about');

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(2);

        // each item should include only first_name + last_name
        for (const member of res.body) {
            expect(member).toHaveProperty('first_name');
            expect(member).toHaveProperty('last_name');

            const keys = Object.keys(member).sort();
            expect(keys).toEqual(['first_name', 'last_name']);
        }
    });
});
