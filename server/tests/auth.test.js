const request = require("supertest");
const app = require("../server");
const prisma = require("../config/database");

let userCookies;

describe("Auth & Users API Integration Tests", () => {
  beforeAll(async () => {
      // Cleanup to prevent P2002 duplicate email errors across tests
      await prisma.users.deleteMany({
          where: { email: { startsWith: "test" } }
      });
  });

  afterAll(async () => {
    // Teardown connections securely
    await prisma.$disconnect();
  });

  const testEmail = `testuser${Date.now()}@example.com`;

  it("should register a new user successfully", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        full_name: "Test User",
        email: testEmail,
        password: "password123",
        role: "student"
      });
      
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(testEmail);
  });

  it("should prevent duplicate registration", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        full_name: "Test User 2",
        email: testEmail, // same as above
        password: "password123",
        role: "student"
      });
      
    expect(res.statusCode).toBe(409); // Conflict error code based on authController HTTP_STATUS.CONFLICT
  });

  it("should login with correct credentials and save session", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: testEmail,
        password: "password123"
      });
      
    expect(res.statusCode).toBe(200);
    expect(res.headers["set-cookie"]).toBeDefined();
    
    // Save session cookies for protected routes
    userCookies = res.headers["set-cookie"];
  });

  it("should block access to admin user routes with student role", async () => {
    const res = await request(app)
      .get("/api/users") // getAllUsers requires admin
      .set("Cookie", userCookies);
      
    expect(res.statusCode).toBe(403);
  });
});
