const PORT = 3000;
const BASE_URL = `http://127.0.0.1:${PORT}/api`;

let cookie = '';
let userId = null;
let courseId = null;
let lessonId = null;

async function request(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };
  if (cookie) {
    options.headers['Cookie'] = cookie;
  }
  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, options);
  
  const setCookie = res.headers.get('set-cookie');
  if (setCookie) {
    cookie = setCookie.split(';')[0];
  }

  let data = null;
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await res.json();
  } else {
    data = await res.text();
  }
  
  return { status: res.status, data };
}

async function runTests() {
  console.log('--- Starting API Tests ---\n');
  const ts = Date.now();
  const testEmail = `user${ts}@test.com`;

  console.log('1. Register Student');
  let res = await request('/auth/register', 'POST', {
    full_name: 'Test Setup User',
    email: testEmail,
    password: 'password123',
    role: 'student'
  });
  console.log(res.status, res.data);
  if (res.status === 201) userId = res.data.data.id;

  console.log('\n2. Login');
  res = await request('/auth/login', 'POST', {
    username: testEmail, // Passport local uses "username" field but we sent "email" previously? 
    // Wait, Passport usually looks at req.body.username unless mapped.
    email: testEmail,
    password: 'password123'
  });
  console.log(res.status, res.data);

  console.log('\n3. Get Profile');
  res = await request('/auth/profile');
  console.log(res.status, res.data);

  console.log('\n4. Update Role to Instructor');
  res = await request(`/users/${userId}`, 'PUT', {
    role: 'instructor'
  });
  console.log(res.status, res.data);

  console.log('\n5. Create Course (as Instructor)');
  res = await request('/courses/create', 'POST', {
    title: `Test Course ${ts}`,
    description: 'A test course description'
  });
  console.log(res.status, res.data);
  if (res.status === 201) courseId = res.data.data.id;
  
  console.log('\n6. Get All Courses');
  res = await request('/courses');
  console.log(res.status, Array.isArray(res.data.data) ? `Got ${res.data.data.length} courses` : res.data);

  if (courseId) {
    console.log('\n7. Create Lesson');
    res = await request('/content/lessons', 'POST', {
      course_id: courseId,
      title: 'Test Lesson 1',
      contentUrl: 'http://test.com/lesson'
    });
    console.log(res.status, res.data);
    if (res.status === 201) lessonId = res.data.data.id;
  
    console.log('\n8. Create Topic');
    res = await request('/content/topics', 'POST', {
      lesson_id: lessonId,
      title: 'Test Topic 1',
      content_body: 'This is the content body'
    });
    console.log(res.status, res.data);
  
    console.log('\n9. Delete Course');
    // Needs confirm_delete because no students
    res = await request(`/courses/${courseId}`, 'DELETE', { confirm_delete: true });
    console.log(res.status, res.data);
  } else {
    console.log('\nSkipping course-dependent tests as course creation failed.');
  }

  console.log('\n10. Logout');
  res = await request('/auth/logout', 'POST');
  console.log(res.status, res.data);
  
  console.log('\n--- Tests Completed ---');
}

runTests().catch(console.error);
