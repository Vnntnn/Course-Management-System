const request = require("supertest");
const app = require("../server");
const prisma = require("../config/database");

let instructorCookies;
let studentCookies;
let courseId;
let instructorId;

describe("Courses API Integration Tests", () => {
  beforeAll(async () => {
    await prisma.courses.deleteMany({ where: { title: { startsWith: "Test Course" } } });
    await prisma.users.deleteMany({ where: { email: { startsWith: "instructor_test" } } });
    await prisma.users.deleteMany({ where: { email: { startsWith: "student_test" } } });

    // Ensure we have an instructor and a student
    const instRes = await request(app).post("/api/auth/register").send({
      full_name: "Instructor Test",
      email: `instructor_test_${Date.now()}@example.com`,
      password: "password123",
      role: "student" // Register only allows student initially
    });
    
    // update to instructor via DB directly because of registration safeguards
    if(instRes.body.data && instRes.body.data.id) {
       await prisma.users.update({ where: { id: instRes.body.data.id }, data: { role: "instructor" }});
       instructorId = instRes.body.data.id;
    }

    const instLogin = await request(app).post("/api/auth/login").send({
      email: instRes.body.data.email,
      password: "password123"
    });
    
    // Check what header comes back
    instructorCookies = instLogin.headers["set-cookie"];

    const studRes = await request(app).post("/api/auth/register").send({
      full_name: "Student Test",
      email: `student_test_${Date.now()}@example.com`,
      password: "password123",
      role: "student"
    });
    const studLogin = await request(app).post("/api/auth/login").send({
      email: studRes.body.data.email,
      password: "password123"
    });
    studentCookies = studLogin.headers["set-cookie"];
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should block course creation for students", async () => {
    const res = await request(app)
      .post("/api/courses/create")
      .set("Cookie", studentCookies)
      .send({ title: "Test Course Forbidden", description: "Desc", thumbnail_url: "" });
    expect(res.statusCode).toBe(403);
  });

  it("should create a course as an instructor", async () => {
    const res = await request(app)
      .post("/api/courses/create")
      .set("Cookie", instructorCookies)
      .send({ title: `Test Course ${Date.now()}`, description: "Description", thumbnail_url: "thumb.jpg" });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBeDefined();
    courseId = res.body.data.id;
  });

  it("should fetch courses list", async () => {
    const res = await request(app).get("/api/courses").set("Cookie", instructorCookies);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should fetch course by id", async () => {
    const res = await request(app).get(`/api/courses/${courseId}`).set("Cookie", instructorCookies);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.id).toBe(courseId);
  });

  it("should update a course", async () => {
    const res = await request(app)
      .put(`/api/courses/${courseId}`)
      .set("Cookie", instructorCookies)
      .send({ title: `Test Course Updated ${Date.now()}`, description: "Updated desc", thumbnail_url: "updated.jpg" });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.description).toBe("Updated desc");
  });

  it("should delete a course", async () => {
    const res = await request(app)
      .delete(`/api/courses/${courseId}`)
      .set("Cookie", instructorCookies)
      .send({ confirm_delete: true });
    expect(res.statusCode).toBe(200);
    
    const check = await request(app).get(`/api/courses/${courseId}`).set("Cookie", instructorCookies);
    expect(check.statusCode).toBe(404);
  });
});
