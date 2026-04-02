const taskService = require("../src/services/taskService");

describe("Task Service", () => {
  beforeEach(() => {
    taskService._reset(); // reset in-memory data
  });

  it("should create a task", () => {
    const task = taskService.create({
      title: "Test Task",
      description: "Testing",
    });

    expect(task).toHaveProperty("id");
    expect(task.title).toBe("Test Task");
    expect(task.status).toBe("todo");
  });

  it("should return all tasks", () => {
    taskService.create({ title: "Task 1" });
    taskService.create({ title: "Task 2" });

    const tasks = taskService.getAll();

    expect(tasks.length).toBe(2);
  });

  it("should find task by id", () => {
    const task = taskService.create({ title: "Find me" });

    const found = taskService.findById(task.id);

    expect(found).toBeDefined();
    expect(found.title).toBe("Find me");
  });

  it("should return null for invalid id", () => {
    const result = taskService.findById("invalid-id");

    expect(result).toBeUndefined(); // important
  });
  
  it("should paginate tasks", () => {
    taskService.create({ title: "Task 1" });
    taskService.create({ title: "Task 2" });
    taskService.create({ title: "Task 3" });

    const result = taskService.getPaginated(1, 2);

    expect(result.length).toBe(2);
    expect(result[0].title).toBe("Task 1");
    expect(result[1].title).toBe("Task 2");
  });
  
  it("should filter tasks by status", () => {
    taskService.create({ title: "Task 1", status: "todo" });
    taskService.create({ title: "Task 2", status: "done" });

    const result = taskService.getByStatus("done");

    expect(result.length).toBe(1);
    expect(result[0].title).toBe("Task 2");
  });
  
  it("should get stats", () => {
    taskService.create({ title: "Task 1", status: "todo" });
    taskService.create({ title: "Task 2", status: "done" });

    const result = taskService.getStats();

    expect(result.todo).toBe(1);
    expect(result.done).toBe(1);
  });
  
  it("should update task", () => {
    const task = taskService.create({ title: "Task 1", status: "todo" });
    taskService.update(task.id, { status: "done" });

    const updated = taskService.findById(task.id);

    expect(updated.status).toBe("done");
  });
  
  it("should delete task", () => {
    const task = taskService.create({ title: "Task 1", status: "todo" });
    taskService.remove(task.id);

    const result = taskService.findById(task.id);

    expect(result).toBeUndefined();
  });
  
  it("should complete task", () => {
    const task = taskService.create({ title: "Task 1", status: "todo" });
    taskService.completeTask(task.id);

    const updated = taskService.findById(task.id);

    expect(updated.status).toBe("done");
  });
  
  it("should reset everything", () => {
    const task = taskService.create({ title: "Task 1", status: "done" });
    taskService._reset();

    const updated = taskService.getAll()

    expect(updated.length).toBe(0);
  });
  
  it("should not create task without title", () => {
    const task = taskService.create({});
  
    expect(task.title).toBeUndefined(); // this exposes bug
  });
  
  it("should return null when updating invalid id", () => {
    const result = taskService.update("invalid-id", { title: "Test" });
  
    expect(result).toBeNull();
  });
  
  it("should return false when deleting invalid id", () => {
    const result = taskService.remove("invalid-id");
  
    expect(result).toBe(false);
  });
  
  it("should return null when completing invalid task", () => {
    const result = taskService.completeTask("invalid-id");
  
    expect(result).toBeNull();
  });
  
  it("should return correct page", () => {
    for (let i = 1; i <= 5; i++) {
      taskService.create({ title: `Task ${i}` });
    }
  
    const result = taskService.getPaginated(2, 2);
  
    expect(result[0].title).toBe("Task 3"); // THIS MAY FAIL 🔥
  });
  
  it("should not match partial status", () => {
    taskService.create({ title: "Task 1", status: "todo" });
  
    const result = taskService.getByStatus("do");
  
    expect(result.length).toBe(0); // WILL FAIL 🔥
  });
});
