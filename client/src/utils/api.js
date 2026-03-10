// Simple fetch wrapper for API calls
const apiFetch = async (url, options = {}) => {
  const response = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    if (response.status === 401) {
      console.warn('Unauthorized');
    }

    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch (e) {
      // If can't parse JSON, use default message
    }
    
    const error = new Error(errorMessage);
    error.response = response;
    error.status = response.status;
    throw error;
  }

  return response.json();
};

// AUTH ENDPOINTS
export const authAPI = {
  register: (data) => apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => apiFetch('/api/auth/logout', { method: 'POST' }),
  me: () => apiFetch('/api/auth/me'),
};

// USER ENDPOINTS
export const userAPI = {
  getAll: () => apiFetch('/api/users'),
  getById: (id) => apiFetch(`/api/users/${id}`),
  update: (id, data) => apiFetch(`/api/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/api/users/${id}`, { method: 'DELETE' }),
  updateProgress: (data) => apiFetch('/api/users/progress', { method: 'POST', body: JSON.stringify(data) }),
};

// COURSE ENDPOINTS
export const courseAPI = {
  getAll: () => apiFetch('/api/courses'),
  getById: (id) => apiFetch(`/api/courses/${id}`),
  create: (data) => apiFetch('/api/courses/create', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/api/courses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id, confirmDelete = false) => apiFetch(`/api/courses/${id}`, { method: 'DELETE', body: JSON.stringify({ confirm_delete: confirmDelete }) }),
  getInstructorCourses: () => apiFetch('/api/courses/my-courses'),
};

// CONTENT ENDPOINTS
export const contentAPI = {
  createLesson: (data) => apiFetch('/api/content/lessons', { method: 'POST', body: JSON.stringify(data) }),
  createTopic: (data) => apiFetch('/api/content/topics', { method: 'POST', body: JSON.stringify(data) }),
  getCourseLessons: (courseId) => apiFetch(`/api/content/courses/${courseId}/lessons`),
};

// ENROLLMENT ENDPOINTS
export const enrollmentAPI = {
  enroll: (data) => apiFetch('/api/enrollments/enroll', { method: 'POST', body: JSON.stringify(data) }),
  getStudentCourses: () => apiFetch('/api/enrollments/my-courses'),
  getCourseStudents: (courseId) => apiFetch(`/api/enrollments/courses/${courseId}/students`),
};

// EXAM ENDPOINTS
export const examAPI = {
  create: (data) => apiFetch('/api/exams', { method: 'POST', body: JSON.stringify(data) }),
  addQuestions: (examId, questions) => apiFetch(`/api/exams/${examId}/questions`, { method: 'POST', body: JSON.stringify({ questions }) }),
  getById: (id) => apiFetch(`/api/exams/${id}`),
  submit: (examId, answers) => apiFetch(`/api/exams/${examId}/submit`, { method: 'POST', body: JSON.stringify({ answers }) }),
  getResults: () => apiFetch('/api/exams/my-results'),
};

// UPLOAD ENDPOINTS
export const uploadAPI = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await fetch('/api/upload', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    if (!response.ok) throw new Error(`Upload failed: ${response.status}`);
    return response.json();
  },
};

