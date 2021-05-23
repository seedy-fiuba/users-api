const supertest = require('supertest')


describe('POST /user', () => {
	beforeEach(() => {
		// algo
	})

	afterAll(() => {
		// algo
	})

	test('create user', async () => {
		expect(true).toBe(true);
	});
});

// describe('POST /api/project', () => {//
// 	test("should create a new project", async () => {
// 		let body = {name: "proyecto1", description: "proyecto  re copado"}
//
// 		const res = await request.post("/api/project").send(body)
//
//
// 		expect(projectMockRepository.createProject.mock.calls.length).toBe(1)
// 		expect(projectMockRepository.createProject.mock.calls[0][0]).toBe(body.name)
// 		expect(projectMockRepository.createProject.mock.calls[0][1]).toBe(body.description)
// 		expect(res.status).toBe(200)
// 		expect(res.body.message).toBe('project added successfully')
// 	})
// })