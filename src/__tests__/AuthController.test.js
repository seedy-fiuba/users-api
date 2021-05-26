const supertest = require('supertest');
const server = require('../server');
let request = supertest(server.app);
const mockingoose = require('mockingoose');
let userModel = require('../models/User');
const hash = require('../utils/hashUtil');

let mockedUser;

beforeEach(() => {
	mockedUser = {
		name: 'jose',
		lastName: 'sbruzzi',
		email: 'tumama@gmail.com',
		password:'contraReLoca',
		role: 'sponsor'
	};
});

describe('POST /user/register', () => {
	mockingoose(userModel);

	beforeEach(() => {
		mockingoose(userModel).reset();
		mockingoose(userModel).toReturn(mockedUser, 'save');
	});

	afterAll(() => {
		jest.clearAllMocks();
	});

	test('Creates user successfully when register with email and password', async () => {
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

	test('Fails when a field is missing for register', async() => {
		let badUser = {
			name: 'jose'
		}

		const res = await request.post('/user/register').send(badUser);

		expect(res.status).toBe(400);
		console.log(res.text);
	});

	test('Fails when role is not in the expected', async() => {
		mockedUser.role = 'another role'

		const res = await request.post('/user/register').send(mockedUser);

		expect(res.status).toBe(400);
		console.log(res.text);
	})

	test('Can register with expected roles', async() => {
		expect(mockedUser.role).toBe('sponsor');
		let res = await request.post('/user/register').send(mockedUser);
		expect(res.status).toBe(200);

		mockedUser.role = 'entrepreneur';
		res = await request.post('/user/register').send(mockedUser);
		expect(res.status).toBe(200);

		mockedUser.role = 'reviewer';
		res = await request.post('/user/register').send(mockedUser);
		expect(res.status).toBe(200);

		mockedUser.role = 'admin';
		res = await request.post('/user/register').send(mockedUser);
		expect(res.status).toBe(200);
	})
});

describe('POST /user/login', () => {
	mockingoose(userModel);

	let userLogin;

	beforeEach(async () => {
		mockingoose(userModel).reset();
		userLogin = {
			email: mockedUser.email,
			password: mockedUser.password
		};
		mockedUser._id = 0;
		mockedUser.password = await hash.encrypt(mockedUser.password);
		mockingoose(userModel).toReturn(mockedUser, 'findOne');
	});

	afterAll(() => {
		jest.clearAllMocks();
	});

	test('Login successful with matching email and password', async () => {
		const res = await request.post('/user/login').send(userLogin);
		expect(res.status).toBe(200);
	});

	test('Unauthorized if password incorrect', async () => {
		userLogin.password = 'another password';
		const res = await request.post('/user/login').send(userLogin);
		expect(res.status).toBe(401);
	});

	test('Fails if user is not registered', async() => {
		userLogin.email = 'invalid email';
		const res = await request.post('/user/login').send(userLogin);
		expect(res.status).toBe(400);
	});
})