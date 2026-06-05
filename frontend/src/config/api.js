const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401 && token) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.hash = '#/login';
    throw new Error('Sesión expirada');
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error del servidor');
  return data;
}

export const api = {
  // Auth
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => request('/auth/me'),
  updateProfile: (data) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),

  // Courses
  getCourses: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/courses/?${q}`);
  },
  getCourse: (slug) => request(`/courses/${slug}`),
  getLesson: (courseId, lessonId) => request(`/courses/${courseId}/lecciones/${lessonId}`),
  getCategories: () => request('/courses/categorias'),
  enroll: (courseId) => request(`/courses/${courseId}/inscribir`, { method: 'POST' }),

  // Progress
  getLessonProgress: (lessonId) => request(`/progress/leccion/${lessonId}`),
  updateProgress: (lessonId, data) => request(`/progress/leccion/${lessonId}`, { method: 'POST', body: JSON.stringify(data) }),
  getCourseProgress: (courseId) => request(`/progress/curso/${courseId}`),
  getProgressSummary: () => request('/progress/resumen'),

  // Evaluations
  submitAnswer: (evalId, respuesta) => request(`/evaluations/${evalId}/responder`, { method: 'POST', body: JSON.stringify({ respuesta }) }),
  getLessonScore: (lessonId) => request(`/evaluations/leccion/${lessonId}/puntaje`),

  // Admin
  getStats: () => request('/admin/stats'),
  createCourse: (data) => request('/admin/cursos', { method: 'POST', body: JSON.stringify(data) }),
  updateCourse: (id, data) => request(`/admin/cursos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCourse: (id) => request(`/admin/cursos/${id}`, { method: 'DELETE' }),
  getUsers: () => request('/admin/usuarios'),

  // GA
  simulate: (data) => request('/ga/simulate', { method: 'POST', body: JSON.stringify(data) }),
  getGAExplain: () => request('/ga/explain'),

  // Health
  health: () => request('/health'),
};

export default api;
