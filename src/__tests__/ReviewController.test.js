const supertest = require('supertest');
const server = require('../server');
let request = supertest(server.app);
const mockingoose = require('mockingoose');
let reviewModel = require('../models/Review');
let UserService = require('../services/UserService');
let ReviewService = require('../services/ReviewService');

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
	};
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
		});
	});

	test('Creates request review successfully', async () => {
		const res = await request.post('/reviews').send(mockedReviewPayload);
		expect(res.status).toBe(201);

		let parsedReview = JSON.parse(res.text);
		expect(parsedReview.reviewerId).toBe(mockedReviewPayload.reviewerId);
		expect(parsedReview.projectId).toBe(mockedReviewPayload.projectId);
	});

	test('Does not create request review without reviewerId', async() => {
		delete mockedReviewPayload.reviewerId;
		const res = await request.post('/reviews').send(mockedReviewPayload);
		expect(res.status).toBe(400);

		let parsedResponse = JSON.parse(res.text);
		expect(parsedResponse.message).toContain('"reviewerId" is required');
	});

	test('Does not create request review without projectId', async() => {
		delete mockedReviewPayload.projectId;
		const res = await request.post('/reviews').send(mockedReviewPayload);
		expect(res.status).toBe(400);

		let parsedResponse = JSON.parse(res.text);
<<<<<<< HEAD
		expect(parsedResponse.message).toContain('\"projectId\" is required');
=======
		expect(parsedResponse.message).toContain('"projectId" is required');
>>>>>>> 166d72f84ba51f14c1e29cce5b0f0a6ef384f7cc
	});

	test('Does not create request review if reviewer not found', async() => {
		getUserSpy.mockImplementation(() => {
			return Promise.resolve(undefined);
		});
		const res = await request.post('/reviews').send(mockedReviewPayload);
		expect(res.status).toBe(404);

		let parsedResponse = JSON.parse(res.text);
		expect(parsedResponse.message).toContain('Reviewer not found');
	});

	test('Does not create request review if user is not a reviewer', async() => {
		mockedUser.role = 'sponsor';
		const res = await request.post('/reviews').send(mockedReviewPayload);
		expect(res.status).toBe(409);

		let parsedResponse = JSON.parse(res.text);
		expect(parsedResponse.message).toContain('User is not a reviewer');
	});

	test('Fail if review request already exists', async() => {
		mockingoose(reviewModel).toReturn({reviewerId: 1, projectId: 2, status: 'rejected'}, 'findOne');

		const res = await request.post('/reviews').send(mockedReviewPayload);
		expect(res.status).toBe(409);

		let parsedResponse = JSON.parse(res.text);
		expect(parsedResponse.message).toContain('Review already requested');
	});
});

describe('PUT /reviews/:id', () => {
	let updateReviewByIdSpy;
	beforeEach(() => {
		mockingoose(reviewModel).reset();
		mockedReviewPayload.status = 'approved';
		updateReviewByIdSpy = jest.spyOn(ReviewService, 'updateReviewRequest');
		updateReviewByIdSpy.mockImplementation(() => {
			return mockedReviewPayload;
		});
	});

	test('Update review with valid status succesfully', async () => {
		const res = await request.put('/reviews/1').send({status: 'approved'});
		expect(res.status).toBe(200);

		let parsedResponse = JSON.parse(res.text);
		expect(parsedResponse.reviewerId).toBe(mockedReviewPayload.reviewerId);
		expect(parsedResponse.projectId).toBe(mockedReviewPayload.projectId);
		expect(parsedResponse.status).toBe(mockedReviewPayload.status);
	});

	test('Does not update if status is invalid', async () => {
		const res = await request.put('/reviews/1').send({status: 'invalidStatus'});
		expect(res.status).toBe(400);

		let parsedResponse = JSON.parse(res.text);
		expect(parsedResponse.message).toContain('Status is invalid');
	});

	test('Does not update if status is not in body', async () => {
		const res = await request.put('/reviews/1').send({field: 'value'});
		expect(res.status).toBe(400);

		let parsedResponse = JSON.parse(res.text);
		expect(parsedResponse.message).toContain('Status field is required');
	});
<<<<<<< HEAD
=======

	test('Does not update if review does not exist', async () => {
		updateReviewByIdSpy.mockImplementation(() => {
			return undefined;
		});

		const res = await request.put('/reviews/1').send({status: 'approved'});
		expect(res.status).toBe(404);

		let parsedResponse = JSON.parse(res.text);
		expect(parsedResponse.message).toContain('Review not found');
	})
>>>>>>> 166d72f84ba51f14c1e29cce5b0f0a6ef384f7cc
});

describe('GET /reviews', () => {
	beforeEach(() => {
		mockingoose(reviewModel).reset();
		mockingoose(reviewModel).toReturn(
			[
				{
					reviewerId: 1,
					projectId: 2,
					status: 'approved'
				},
				{
					reviewerId: 1,
					projectId: 4,
					status: 'rejected'
				}
			], 'find');
	});

	test('Gets all reviews', async () => {
		const res = await request.get('/reviews?reviewerId=1');
		expect(res.status).toBe(200);

		let parsedResponse = JSON.parse(res.text);
		expect(parsedResponse.size).toBe(2);
		expect(parsedResponse.results[0].reviewerId).toBe(1);
		expect(parsedResponse.results[1].reviewerId).toBe(1);
	});

	test('Gets all reviews with invalid status', async () => {
		const res = await request.get('/reviews?reviewerId=1&status=invalid');
		expect(res.status).toBe(400);

		console.log(res.text);

		let parsedResponse = JSON.parse(res.text);
<<<<<<< HEAD
		expect(parsedResponse.message).toContain('\"status\" must be one of [pending, approved, rejected]');
=======
		expect(parsedResponse.message).toContain('"status" must be one of [pending, approved, rejected]');
>>>>>>> 166d72f84ba51f14c1e29cce5b0f0a6ef384f7cc
	});
});