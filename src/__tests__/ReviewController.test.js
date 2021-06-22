const supertest = require('supertest');
const server = require('../server');
let request = supertest(server.app);
const mockingoose = require('mockingoose');
let reviewModel = require('../models/Review');
let UserService = require('../services/UserService');

let mockedReviewPayload;
let mockedUser;

beforeEach(() => {
    mockedUser = {
        id: 1,
        name: 'jose',
        lastName: 'sbruzzi',
        email: 'josbruzzi@gmail.com',
        role: 'reviewer'
    };

    mockedReviewPayload = {
        reviewerId: 1,
        projectId: 2
    }
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('POST /reviews', () => {
    let getUserSpy;
    beforeEach(() => {
        mockingoose(reviewModel).reset();
        mockingoose(reviewModel).toReturn(mockedReviewPayload, 'save');
        getUserSpy = jest.spyOn(UserService, 'getUserById');
        getUserSpy.mockImplementation(() => {
            return Promise.resolve(mockedUser);
        })
    });

    test('Creates request review successfully', async () => {
        const res = await request.post('/reviews').send(mockedReviewPayload);
        expect(res.status).toBe(201);

        let parsedReview = JSON.parse(res.text);
        expect(parsedReview.reviewerId).toBe(mockedReviewPayload.reviewerId);
        expect(parsedReview.projectId).toBe(mockedReviewPayload.projectId);
    })
});