jest.mock('google-auth-library');
const { OAuth2Client } = require('google-auth-library');
const supertest = require('supertest');
const server = require('../server');
let request = supertest(server.app);
const mockingoose = require('mockingoose');
let userModel = require('../models/User');
const hash = require('../utils/hashUtil');
const UserService = require('../services/UserService');

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

	afterEach(() => {
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

	afterEach(() => {
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

describe('POST /user/google_login', () => {

	let verifyIdTokenMock;
	let createUserSpy;
	let getUserByMailSpy;
	let idTokenBody;

	beforeEach(() => {
		idTokenBody = {
			idToken: 'token'
		}
		createUserSpy = jest.spyOn(UserService, 'createUser');
		getUserByMailSpy = jest.spyOn(UserService, 'getUserByMail');
		verifyIdTokenMock = jest.fn()
		OAuth2Client.mockImplementation(() => {
			return {
				verifyIdToken: verifyIdTokenMock
			}
		})
		verifyIdTokenMock.mockReturnValue({ getPayload: () => {
				return {
					email: mockedUser.email,
					given_name: mockedUser.name,
					family_name: mockedUser.lastName,
				}
			}
		});
		mockingoose(userModel).toReturn(mockedUser, 'findOne');
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test("should verify token successfully...", async () => {
		const res = await request.post('/user/google_login').send(idTokenBody);

		expect(verifyIdTokenMock).toHaveBeenCalledWith({ idToken: 'token', audience: process.env.GOOGLE_CLIENT_ID });
		expect(res.status).toBe(200);
		let parsedBody = JSON.parse(res.text);

		expect(parsedBody.token).toBeDefined();
		expect(parsedBody.user).toBeDefined();
	});

	test('should register user if does not exist', async() => {
		mockingoose(userModel).toReturn(undefined, 'findOne');

		const res = await request.post('/user/google_login').send(idTokenBody);
		expect(res.status).toBe(200);

		expect(getUserByMailSpy).toHaveBeenCalledTimes(1);
		expect(createUserSpy).toHaveBeenCalledTimes(1);
	});

	test('should login user if already registered', async() => {
		const res = await request.post('/user/google_login').send(idTokenBody);
		expect(res.status).toBe(200);

		expect(getUserByMailSpy).toHaveBeenCalledTimes(1);
		expect(createUserSpy).toHaveBeenCalledTimes(0);
	});
})