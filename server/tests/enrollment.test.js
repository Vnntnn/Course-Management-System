const request = require("supertest");
const app = require("../server");
const prisma = require("../config/database");

let studentCookies;
let studentColCookies;
let instructorCookies;
let courseId;

describe("Enrollments API Integration Tests", () => {
  beforeAll(async () => {
    // Clear old test data
    await prisma.courses.deleteMany({ where: { title: "Enroll Test Course" } });
    await prisma.users.deleteMany({ where: { email: { startsWith: "enroll_" } } });

    // Register Student
    const student1 = await request(app).post("/api/auth/register").send({
      full_name: "Enroll Stud", email: "enroll_student@test.com", password: "password123", role: "student"
    });
    const sLogin1 = await request(app).post("/api/auth/login").send({
      email: "enroll_student@test.com", password: "password123"
    });
    studentCookies = sLogin1.headers["set-cookie"];

    // Register another Student for collision checks
    const student2 = await request(app).post("/api/auth/register").send({
      full_name: "Enroll Stud 2", email: "enroll_student2@test.com", password: "password123", role: "student"
    });
    const sLogin2 = await request(app).post("/api/auth/login").send({
      email: "enroll_student2@test.com", password: "password123"
    });
    studentColCookies = sLogin2.headers["set-cookie"];

    // Register Instructor
    const instructor1 = await request(app).post("/api/auth/register").send({
      full_name: "Enroll Inst", email: "enroll_inst@test.com", password: "password123", role: "student"
    });
    await prisma.users.update({ where: { id: instructor1.body.data.id }, data: { role: "instructor" }});
    const instLogin = await request(app).post("/api/auth/login").send({
      email: "enroll_inst@test.com", password: "password123"
    });
    instructorCookies = instLogin.headers["set-cookie"];

    // Instructor creates course
    const cRes = await request(app).post("/api/courses/create").set("Cookie", instructorCookies).send({
      title: "Enroll Test Course", description: "testing enrollments", thumbnail_url: ""
    });
    courseId = cRes.body.data.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should enroll a student in a course", async () => {
    const res = await request(app)
      .post("/api/enrollments/enroll")
      .set("Cookie", studentCookies)
      .send({ course_id: courseId });
    expect(res.statusCode).toBe(201);
    expect(res.body.data.course_id).toBe(courseId);
  });

  it("should reject duplicate enrollment", async () => {
    const res = await request(app)
      .post("/api/enrollments/enroll")
      .set("Cookie", studentCookies)
      .send({ course_id: courseId });
    expect(res.statusCode).toBe(400); // Usually P2002 duplicate mapping
  });

  it("should get enrolled courses for student", async () => {
    const res = await request(app)
      .get("/api/enrollments/my-courses")
      .set("Cookie", studentCookies);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].course_id).toBe(courseId);
  });

  it("should fetch students enrolled in course (instructor)", async () => {
    const res = await request(app)
      .get(`/api/enrollments/courses/${courseId}/students`)
      .set("Cookie", instructorCookies);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });
});
