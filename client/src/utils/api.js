// Simple cache for GET requests
const cache = new Map();
const CACHE_TTL = 10000; // 10 seconds

const getCached = (key) => {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data;
  }
  cache.delete(key);
  return null;
};

const setCache = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() });
};

export const clearCache = (pattern) => {
  if (!pattern) {
    cache.clear();
  } else {
    for (const key of cache.keys()) {
      if (key.includes(pattern)) cache.delete(key);
    }
  }
};

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

// Cached GET request
const cachedGet = async (url) => {
  const cached = getCached(url);
  if (cached) return cached;
  
  const data = await apiFetch(url);
  setCache(url, data);
  return data;
};

// AUTH ENDPOINTS
export const authAPI = {
  register: (data) => apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => { clearCache(); return apiFetch('/api/auth/logout', { method: 'POST' }); },
  me: () => cachedGet('/api/auth/me'),
};

// USER ENDPOINTS
export const userAPI = {
  getAll: () => cachedGet('/api/users'),
  getById: (id) => cachedGet(`/api/users/${id}`),
  update: (id, data) => { clearCache('/api/users'); return apiFetch(`/api/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }); },
  delete: (id) => { clearCache('/api/users'); return apiFetch(`/api/users/${id}`, { method: 'DELETE' }); },
  updateProgress: (data) => { clearCache('/api/users/progress'); return apiFetch('/api/users/progress', { method: 'POST', body: JSON.stringify(data) }); },
  getCompletedTopics: (courseId) => apiFetch(`/api/users/progress/${courseId}`), // No cache - always fetch fresh
};

// COURSE ENDPOINTS
export const courseAPI = {
  getAll: () => cachedGet('/api/courses'),
  getById: (id, details = false) => apiFetch(`/api/courses/${id}${details ? '?details=true' : ''}`), // No cache for individual courses
  create: (data) => { clearCache('/api/courses'); return apiFetch('/api/courses/create', { method: 'POST', body: JSON.stringify(data) }); },
  update: (id, data) => { clearCache('/api/courses'); return apiFetch(`/api/courses/${id}`, { method: 'PUT', body: JSON.stringify(data) }); },
  delete: (id, confirmDelete = false) => { clearCache('/api/courses'); return apiFetch(`/api/courses/${id}`, { method: 'DELETE', body: JSON.stringify({ confirm_delete: confirmDelete }) }); },
  getInstructorCourses: () => cachedGet('/api/courses/my-courses'),
};

// CONTENT ENDPOINTS
export const contentAPI = {
  createLesson: (data) => { clearCache('/api/content'); clearCache('/api/courses'); return apiFetch('/api/content/lessons', { method: 'POST', body: JSON.stringify(data) }); },
  updateLesson: (lessonId, data) => { clearCache('/api/content'); clearCache('/api/courses'); return apiFetch(`/api/content/lessons/${lessonId}`, { method: 'PUT', body: JSON.stringify(data) }); },
  deleteLesson: (lessonId) => { clearCache('/api/content'); clearCache('/api/courses'); return apiFetch(`/api/content/lessons/${lessonId}`, { method: 'DELETE' }); },
  createTopic: (data) => { clearCache('/api/content'); clearCache('/api/courses'); return apiFetch('/api/content/topics', { method: 'POST', body: JSON.stringify(data) }); },
  updateTopic: (topicId, data) => { clearCache('/api/content'); clearCache('/api/courses'); return apiFetch(`/api/content/topics/${topicId}`, { method: 'PUT', body: JSON.stringify(data) }); },
  deleteTopic: (topicId) => { clearCache('/api/content'); clearCache('/api/courses'); return apiFetch(`/api/content/topics/${topicId}`, { method: 'DELETE' }); },
  getCourseLessons: (courseId) => cachedGet(`/api/content/courses/${courseId}/lessons`),
};

// ENROLLMENT ENDPOINTS
export const enrollmentAPI = {
  enroll: (data) => apiFetch('/api/enrollments/enroll', { method: 'POST', body: JSON.stringify(data) }),
  getStudentCourses: () => apiFetch('/api/enrollments/my-courses'),
  getCourseStudents: (courseId) => apiFetch(`/api/enrollments/courses/${courseId}/students`),
};

// EXAM ENDPOINTS
export const examAPI = {
  create: (data) => { clearCache('/api/exams'); return apiFetch('/api/exams', { method: 'POST', body: JSON.stringify(data) }); },
  update: (examId, data) => { clearCache('/api/exams'); return apiFetch(`/api/exams/${examId}`, { method: 'PUT', body: JSON.stringify(data) }); },
  delete: (examId) => { clearCache('/api/exams'); return apiFetch(`/api/exams/${examId}`, { method: 'DELETE' }); },
  addQuestions: (examId, questions) => { clearCache('/api/exams'); return apiFetch(`/api/exams/${examId}/questions`, { method: 'POST', body: JSON.stringify({ questions }) }); },
  updateQuestion: (questionId, data) => { clearCache('/api/exams'); return apiFetch(`/api/exams/questions/${questionId}`, { method: 'PUT', body: JSON.stringify(data) }); },
  deleteQuestion: (questionId) => { clearCache('/api/exams'); return apiFetch(`/api/exams/questions/${questionId}`, { method: 'DELETE' }); },
  getById: (id) => cachedGet(`/api/exams/${id}`),
  getByCourse: (courseId) => cachedGet(`/api/exams/course/${courseId}`),
  submit: (examId, answers) => { clearCache('/api/exams'); return apiFetch(`/api/exams/${examId}/submit`, { method: 'POST', body: JSON.stringify({ answers }) }); },
  getResults: () => cachedGet('/api/exams/my-results'),
};

// UPLOAD ENDPOINTS
export const uploadAPI = {
  uploadImage: async (file, courseId) => {
    const formData = new FormData();
    formData.append('image', file);
    if (courseId) formData.append('courseId', courseId);
    const response = await fetch('/api/upload', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    if (!response.ok) throw new Error(`Upload failed: ${response.status}`);
    return response.json();
  },
};

