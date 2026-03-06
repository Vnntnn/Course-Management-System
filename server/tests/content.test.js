const request = require("supertest");
const app = require("../server");
const prisma = require("../config/database");

let instructorCookies;
let courseId;
let lessonId;
let topicId;

describe("Content API Integration Tests (Lessons and Topics)", () => {
  beforeAll(async () => {
    await prisma.courses.deleteMany({ where: { title: "Content Test Course" } });
    await prisma.users.deleteMany({ where: { email: "content_inst@test.com" } });

    // Register Instructor
    const inst = await request(app).post("/api/auth/register").send({
      full_name: "Content Inst", email: "content_inst@test.com", password: "password123", role: "student"
    });
    await prisma.users.update({ where: { id: inst.body.data.id }, data: { role: "instructor" }});
    const instLogin = await request(app).post("/api/auth/login").send({
      email: "content_inst@test.com", password: "password123"
    });
    instructorCookies = instLogin.headers["set-cookie"];

    // Make Course
    const cRes = await request(app).post("/api/courses/create").set("Cookie", instructorCookies).send({
      title: "Content Test Course", description: "testing content", thumbnail_url: ""
    });
    courseId = cRes.body.data.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should create a lesson", async () => {
    const res = await request(app)
      .post("/api/content/lessons")
      .set("Cookie", instructorCookies)
      .send({ course_id: courseId, title: "Lesson 1", order_index: 0 });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    lessonId = res.body.data.id;
  });

  it("should create a topic inside a lesson", async () => {
    const res = await request(app)
      .post("/api/content/topics")
      .set("Cookie", instructorCookies)
      .send({
        lesson_id: lessonId,
        title: "Topic 1",
        content_type: "text",
        content_body: "Hello World",
        order_index: 0
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    topicId = res.body.data.id;
  });

  it("should get lessons by course", async () => {
    const res = await request(app)
      .get(`/api/content/courses/${courseId}/lessons`)
      .set("Cookie", instructorCookies);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].topics.length).toBeGreaterThan(0);
    expect(res.body.data[0].topics[0].id).toBe(topicId);
  });
});
