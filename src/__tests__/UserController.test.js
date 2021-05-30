const supertest = require('supertest');
const server = require('../server');
let request = supertest(server.app);
const mockingoose = require('mockingoose');
let userModel = require('../models/User');
let UserService = require('../services/UserService');

let mockedPaginatedUsers;
let mockedUserPayload;

beforeEach(() => {
    mockedUserPayload = {
        name: 'jose',
        lastName: 'sbruzzi',
        email: 'tumama@gmail.com',
        password: 'contraReLoca',
        role: 'sponsor'
    };
    mockedPaginatedUsers = {
        docs: [
            {
                id: 1,
                name: "Fulanito1",
                lastName: "Ferrero",
                email: "fulanito1@fi.uba.ar",
                role: "entrepreneur",
                createdAt: "2021-05-27T22:33:27.069+00:00",
                updatedAt: "2021-05-27T22:33:27.069+00:00"
            },
            {
                id: 2,
                name: "Fulanito2",
                lastName: "Ferrero",
                email: "fulanito2@fi.uba.ar",
                role: "sponsor",
                createdAt: "2021-05-27T22:33:27.069+00:00",
                updatedAt: "2021-05-27T22:33:27.069+00:00"
            }
        ],
        totalDocs: 2,
        totalPages: 1,
        page: 1
    }
});

afterEach(() => {
    jest.clearAllMocks();
})

describe('POST /users', () => {
    beforeEach(() => {
        mockingoose(userModel).reset();
        mockingoose(userModel).toReturn(mockedUserPayload, 'save');
    });

    test('Creates user successfully when register with email and password', async () => {
        const res = await request.post('/users').send(mockedUserPayload);

        expect(res.status).toBe(200);

        let parsedUser = JSON.parse(res.text);
        expect(parsedUser.id.length).toBeGreaterThan(0);
        expect(parsedUser.name).toBe(mockedUserPayload.name);
        expect(parsedUser.lastName).toBe(mockedUserPayload.lastName);
        expect(parsedUser.email).toBe(mockedUserPayload.email);
        expect(parsedUser.role).toBe(mockedUserPayload.role);
        expect(parsedUser.password).toBeUndefined();
    });

    test('Fails when a field is missing for register', async () => {
        let badUser = {
            name: 'jose'
        }

        const res = await request.post('/users').send(badUser);

        expect(res.status).toBe(400);
        console.log(res.text);
    });

    test('Fails when role is not in the expected', async () => {
        mockedUserPayload.role = 'another role'

        const res = await request.post('/users').send(mockedUserPayload);

        expect(res.status).toBe(400);
    })

    test('Can register with expected roles', async () => {
        expect(mockedUserPayload.role).toBe('sponsor');
        let res = await request.post('/users').send(mockedUserPayload);
        expect(res.status).toBe(200);

        mockedUserPayload.role = 'entrepreneur';
        res = await request.post('/users').send(mockedUserPayload);
        expect(res.status).toBe(200);

        mockedUserPayload.role = 'reviewer';
        res = await request.post('/users').send(mockedUserPayload);
        expect(res.status).toBe(200);

        mockedUserPayload.role = 'admin';
        res = await request.post('/users').send(mockedUserPayload);
        expect(res.status).toBe(200);
    })
});

describe('GET /users', () => {
    let getUsersSpy;

    beforeAll(() => {
        getUsersSpy = jest.spyOn(UserService, 'getUsers');
    });

    test('get users paginated successfully', async () => {
        getUsersSpy.mockImplementation(() => {
            return Promise.resolve(mockedPaginatedUsers);
        });

        const res = await request.get('/users');
        expect(res.status).toBe(200);

        let parsedBody = JSON.parse(res.text);
        expect(parsedBody.totalItems).toBe(mockedPaginatedUsers.totalDocs);
        expect(parsedBody.users.length).toBe(mockedPaginatedUsers.docs.length);
        expect(parsedBody.totalPages).toBe(mockedPaginatedUsers.totalPages);
        expect(parsedBody.currentPage).toBe(mockedPaginatedUsers.page - 1);
    });

    test('get users paginated failed', async () => {
        getUsersSpy.mockImplementation(() => {
            throw Error();
        });

        const res = await request.get('/users');
        expect(res.status).toBe(500);
    })
});

describe('GET /users/:id', () => {
    let getUserSpy;
    beforeEach(() => {
        getUserSpy = jest.spyOn(UserService, 'getUserById');
    });

    test('Gets user successfully', async () => {
        getUserSpy.mockImplementation(() => {
            return mockedUserPayload;
        })

        const res = await request.get('/users/1');
        expect(res.status).toBe(200);
        expect(JSON.parse(res.text)).toMatchObject(mockedUserPayload);
    });

    test('Gets 404 if user does not exist', async() => {
        getUserSpy.mockImplementation(() => {
            return undefined;
        })

        const res = await request.get('/users/2');
        expect(res.status).toBe(404);
    });
});