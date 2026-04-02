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
});
