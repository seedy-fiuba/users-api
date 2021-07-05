jest.mock('google-auth-library');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
jest.mock('jsonwebtoken');
const supertest = require('supertest');
const server = require('../server');
let request = supertest(server.app);
const mockingoose = require('mockingoose');
let userModel = require('../models/User');
const hash = require('../utils/hashUtil');
const UserService = require('../services/UserService');

let mockedUser;
let jwtSignVerify;

beforeAll(() => {
	jwtSignVerify = jest.spyOn(jwt, 'sign');
	jwtSignVerify.mockImplementation(() => { return { token: 'token' };});
});

beforeEach(() => {
	mockedUser = {
		name: 'jose',
		lastName: 'sbruzzi',
		email: 'tumama@gmail.com',
		password:'contraReLoca',
		role: 'sponsor'
	};
});

describe('POST /auth/login', () => {
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
		const res = await request.post('/auth/login').send(userLogin);
		expect(res.status).toBe(200);
		expect(jwtSignVerify).toHaveBeenCalledTimes(1);

		let parsedBody = JSON.parse(res.text);
		expect(parsedBody.user).toBeDefined();
		expect(parsedBody.token).toBeDefined();
	});

	test('Login fails with invalida body', async () => {
		const res = await request.post('/auth/login').send({});
		expect(res.status).toBe(400);
	});

	test('Unauthorized if password incorrect', async () => {
		userLogin.password = 'another password';
		const res = await request.post('/auth/login').send(userLogin);
		expect(res.status).toBe(401);
	});

	test('Fails if user is not registered', async() => {
		mockingoose(userModel).toReturn(undefined, 'findOne');
		const res = await request.post('/auth/login').send(userLogin);
		expect(res.status).toBe(400);
	});
});

describe('POST /auth/google_login', () => {

	let verifyIdTokenMock;
	let createUserSpy;
	let getUserByMailSpy;
	let idTokenBody;

	beforeEach(() => {
		idTokenBody = {
			idToken: 'token'
		};
		createUserSpy = jest.spyOn(UserService, 'createUser');
		getUserByMailSpy = jest.spyOn(UserService, 'getUserByMail');
		verifyIdTokenMock = jest.fn();
		OAuth2Client.mockImplementation(() => {
			return {
				verifyIdToken: verifyIdTokenMock
			};
		});
		verifyIdTokenMock.mockReturnValue({ getPayload: () => {
			return {
				email: mockedUser.email,
				given_name: mockedUser.name,
				family_name: mockedUser.lastName,
			};
		}
		});
		mockingoose(userModel).toReturn(mockedUser, 'findOne');
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test('should verify token successfully...', async () => {
		const res = await request.post('/auth/google_login').send(idTokenBody);

		expect(verifyIdTokenMock).toHaveBeenCalledWith({ idToken: 'token', audience: process.env.GOOGLE_CLIENT_ID });
		expect(res.status).toBe(200);

		expect(jwtSignVerify).toHaveBeenCalledTimes(1);

		let parsedBody = JSON.parse(res.text);
		expect(parsedBody.token).toBeDefined();
		expect(parsedBody.user).toBeDefined();
	});

	test('should register user if does not exist', async() => {
		mockingoose(userModel).toReturn(undefined, 'findOne');

		const res = await request.post('/auth/google_login').send(idTokenBody);
		expect(res.status).toBe(200);

		expect(getUserByMailSpy).toHaveBeenCalledTimes(1);
		expect(createUserSpy).toHaveBeenCalledTimes(1);
	});

	test('should login user if already registered', async() => {
		const res = await request.post('/auth/google_login').send(idTokenBody);
		expect(res.status).toBe(200);

		expect(getUserByMailSpy).toHaveBeenCalledTimes(1);
		expect(createUserSpy).toHaveBeenCalledTimes(0);
	});
});

describe('POST /auth/authenticate', () => {

	let tokenBody;
	let verifySpy;

	beforeAll(() => {
		tokenBody = {
			authToken: 'sdflnewlkntlekngskndflksnlerte'
		};
		verifySpy = jest.spyOn(jwt, 'verify');
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test('user is unauthorized if token is invalid', async () => {
		verifySpy.mockImplementation((token, secret, callback) => callback(new Error(), undefined));

		const res = await request.post('/auth/authenticate').send(tokenBody);
		expect(res.status).toBe(401);
	});

	test('user is authorized if token is valid', async () => {
		verifySpy.mockImplementation((token, secret, callback) => callback(undefined, 'kk'));

		const res = await request.post('/auth/authenticate').send(tokenBody);
		expect(res.status).toBe(200);

		let parsedBody = JSON.parse(res.text);
		expect(parsedBody.message).toBe('authorized');
		expect(parsedBody.identity).toBeDefined();
	});
});