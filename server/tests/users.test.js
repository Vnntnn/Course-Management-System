const request = require("supertest");
const app = require("../server");
const prisma = require("../config/database");

let adminCookies;
let studentCookies;
let studentId;
let courseId;
let topicId;

describe("Users API Integration Tests", () => {
  beforeAll(async () => {
    await prisma.courses.deleteMany({ where: { title: "User Progress Course" } });
    await prisma.users.deleteMany({ where: { email: { startsWith: "u_" } } });

    // Admin
    const aRes = await request(app).post("/api/auth/register").send({
      full_name: "Admin User", email: "u_admin@test.com", password: "password123", role: "student"
    });
    await prisma.users.update({ where: { id: aRes.body.data.id }, data: { role: "admin" } });
    const aLog = await request(app).post("/api/auth/login").send({ email: "u_admin@test.com", password: "password123" });
    adminCookies = aLog.headers["set-cookie"];

    // Student
    const sRes = await request(app).post("/api/auth/register").send({
      full_name: "Stud User", email: "u_student@test.com", password: "password123", role: "student"
    });
    studentId = sRes.body.data.id;
    const sLog = await request(app).post("/api/auth/login").send({ email: "u_student@test.com", password: "password123" });
    studentCookies = sLog.headers["set-cookie"];

    // Instructor creates course, lesson, topic directly via Prisma for speed
    const cData = await prisma.courses.create({
        data: { title: "User Progress Course", description: "test", instructor_id: aRes.body.data.id, thumbnail_url: "" }
    });
    courseId = cData.id;
    
    const lData = await prisma.lessons.create({
        data: { course_id: courseId, title: "L1", order_index: 1 }
    });

    const tData = await prisma.topics.create({
        data: { lesson_id: lData.id, title: "T1", content_type: "text", content_body: "Hi", order_index: 1 }
    });
    topicId = tData.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should get user by ID", async () => {
    const res = await request(app).get(`/api/users/${studentId}`).set("Cookie", studentCookies);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.email).toBe("u_student@test.com");
  });

  it("should update user profile", async () => {
    const res = await request(app)
      .put(`/api/users/${studentId}`)
      .set("Cookie", studentCookies)
      .send({ full_name: "Updated Student Name" });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.full_name).toBe("Updated Student Name");
  });

  it("should mark topic as complete and calculate progress", async () => {
     const res = await request(app)
       .post(`/api/users/progress`)
       .set("Cookie", studentCookies)
       .send({ course_id: courseId, topic_id: topicId });
     expect(res.statusCode).toBe(200);
     expect(res.body.data).toBe(100); // 1 topic out of 1 total topics = 100%
  });

  it("should delete user (admin only)", async () => {
    const res = await request(app).delete(`/api/users/${studentId}`).set("Cookie", adminCookies);
    expect(res.statusCode).toBe(200);
    const check = await request(app).get(`/api/users/${studentId}`).set("Cookie", adminCookies);
    expect(check.statusCode).toBe(404);
  });
});
