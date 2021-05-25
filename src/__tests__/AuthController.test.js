const supertest = require('supertest');
const server = require('../server');
let request = supertest(server.app);
const mockingoose = require('mockingoose');
let userModel = require('../models/User');

let mockedUser;

beforeAll(() => {
	mockedUser = {
		name: 'jose',
		lastName: 'sbruzzi',
		email: 'tumama@gmail.com',
		password:'contraReLoca',
		role: 'sponsor'
	};
});

describe('POST /user', () => {
	mockingoose(userModel);

	beforeEach(() => {
		mockingoose(userModel).reset();
	});

	afterAll(() => {
		jest.clearAllMocks();
	});

	test('create user', async () => {
		mockingoose(userModel).toReturn(mockedUser, 'save');

		const res = await request.post('/user/register').send(mockedUser);

		expect(res.status).toBe(200);
		let parsedUser = JSON.parse(res.text);

		expect(parsedUser.id.length).toBeGreaterThan(0);
		expect(parsedUser.name).toBe(mockedUser.name);
		expect(parsedUser.lastName).toBe(mockedUser.lastName);
		expect(parsedUser.email).toBe(mockedUser.email);
		expect(parsedUser.role).toBe(mockedUser.role);
		expect(parsedUser.password).toBeUndefined();
	});
});