const PORT = 3000;
const BASE_URL = 'http://127.0.0.1:' + PORT + '/api';

async function request(endpoint, method = 'GET', body = null, useCookie = '') {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  };
  if (useCookie) options.headers['Cookie'] = useCookie;
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(BASE_URL + endpoint, options);
  
  const setCookie = res.headers.get('set-cookie');
  let newCookie = '';
  if (setCookie) newCookie = setCookie.split(';')[0];

  let data = null;
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await res.json();
  } else {
    data = await res.text();
  }
  
  return { status: res.status, data, cookie: newCookie || useCookie };
}

async function run() {
  const ts = Date.now();
  const insEmail = 'ins' + ts + '@t.com';
  const stuEmail = 'stu' + ts + '@t.com';
  let cookie1, cookie2, instructorId, studentId, courseId;

  console.log('1. Register Instructor');
  const bcrypt = require('bcryptjs');
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  const hashedPassword = await bcrypt.hash('password1', 10);
  const insUser = await prisma.users.create({
    data: {
      full_name: 'Inst',
      email: insEmail,
      password_hash: hashedPassword,
      role: 'instructor'
    }
  });
  instructorId = insUser.id;
  
  let r = await request('/auth/login', 'POST', { email: insEmail, password: 'password1' });
  cookie1 = r.cookie;

  console.log('\n2. Register Student');
  r = await request('/auth/register', 'POST', { full_name: 'Stu', email: stuEmail, password: 'password1', role: 'student' });
  console.log(r.status, r.data);
  studentId = r.data.data.id;

  r = await request('/auth/login', 'POST', { email: stuEmail, password: 'password1' });
  cookie2 = r.cookie;

  console.log('\n3. Create Course with Instructor');
  r = await request('/courses/create', 'POST', { title: 'C' + ts, description: 'Desc' }, cookie1);
  console.log(r.status, r.data);
  courseId = r.data.data.id;

  console.log('\n4. Enroll Student in Course');
  r = await request('/enrollments/enroll', 'POST', { course_id: courseId }, cookie2);
  console.log(r.status, r.data);

  console.log('\n5. Student My Courses');
  r = await request('/enrollments/my-courses', 'GET', null, cookie2);
  console.log(r.status, r.data);

  console.log('\n6. Instructor sees Enrolled Students');
  r = await request('/enrollments/courses/' + courseId + '/students', 'GET', null, cookie1);
  console.log(r.status, JSON.stringify(r.data, null, 2));

//   console.log('\n7. Student Unenrolls');
//   r = await request('/enrollments/unenroll/' + courseId, 'DELETE', null, cookie2);
//   console.log(r.status, r.data);

  console.log('\n8. Verify Empty My Courses');
  r = await request('/enrollments/my-courses', 'GET', null, cookie2);
  console.log(r.status, r.data);
}
run().catch(console.error);
