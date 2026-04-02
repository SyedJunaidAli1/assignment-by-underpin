const request = require("supertest");
const app = require("../src/app");
const taskService = require("../src/services/taskService");

describe("Task API", () => {
  beforeEach(() => {
    taskService._reset(); // reset data before each test
  });

  it("should create a task", async () => {
    const res = await request(app).post("/tasks").send({ title: "API Task" });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("API Task");
  });
  it("should get all tasks", async () => {
    await request(app).post("/tasks").send({ title: "Task 1" });
    await request(app).post("/tasks").send({ title: "Task 2" });

    const res = await request(app).get("/tasks");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it("should fail to create task without title", async () => {
    const res = await request(app).post("/tasks").send({});

    expect(res.statusCode).toBe(400); // because your error handler returns 500
  });

  it("should update a task", async () => {
    const createRes = await request(app)
      .post("/tasks")
      .send({ title: "Old Task" });

    const id = createRes.body.id;

    const res = await request(app)
      .put(`/tasks/${id}`)
      .send({ title: "Updated Task" });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Updated Task");
  });
  
  it("should delete a task", async () => {
    const createRes = await request(app)
      .post("/tasks")
      .send({ title: "Delete me" });
  
    const id = createRes.body.id;
  
    const res = await request(app).delete(`/tasks/${id}`);
  
    expect(res.statusCode).toBe(204);
  });
  
  it("should complete a task", async () => {
    const createRes = await request(app)
      .post("/tasks")
      .send({ title: "Complete me" });
  
    const id = createRes.body.id;
  
    const res = await request(app)
      .patch(`/tasks/${id}/complete`);
  
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("done");
  });
  
  it("should return 404 for non-existing task", async () => {
    const res = await request(app)
      .get("/tasks/invalid-id");
  
    expect(res.statusCode).toBe(404);
  });
});
