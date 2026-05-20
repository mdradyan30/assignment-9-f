// Centralized API helper. Reads token from localStorage and attaches it.

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('ideavault_token');
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    let data;
    try {
      data = await res.json();
    } catch {
      data = {};
    }

    if (!res.ok) {
      const errorMsg = data.message || data.error || `HTTP ${res.status}: ${res.statusText}`;
      console.error(`[API Error] ${method} ${path}:`, errorMsg, data);
      throw new Error(errorMsg);
    }

    console.log(`[API Success] ${method} ${path}:`, data);
    return data;
  } catch (err) {
    if (err instanceof TypeError) {
      console.error(`[Network Error] Cannot reach ${API_URL}${path}:`, err.message);
      throw new Error(`Cannot connect to server at ${API_URL}. Make sure the backend is running.`);
    }
    throw err;
  }
}

export const api = {
  // ---- auth ----
  register: (payload) =>
    request('/api/auth/register', { method: 'POST', body: payload }),
  login: (payload) =>
    request('/api/auth/login', { method: 'POST', body: payload }),
  googleLogin: (payload) =>
    request('/api/auth/google', { method: 'POST', body: payload }),

  // ---- profile ----
  getProfile: () => request('/api/users/me', { auth: true }),
  updateProfile: (payload) =>
    request('/api/users/me', { method: 'PATCH', body: payload, auth: true }),

  // ---- ideas ----
  getIdeas: (queryString = '') => request(`/api/ideas${queryString}`),
  getTrending: (limit = 6) => request(`/api/ideas/trending?limit=${limit}`),
  getRecent: (limit = 6) => request(`/api/ideas?sort=-createdAt&limit=${limit}`),
  getIdea: (id) => request(`/api/ideas/${id}`),
  createIdea: (payload) =>
    request('/api/ideas', { method: 'POST', body: payload, auth: true }),
  updateIdea: (id, payload) =>
    request(`/api/ideas/${id}`, { method: 'PUT', body: payload, auth: true }),
  deleteIdea: (id) =>
    request(`/api/ideas/${id}`, { method: 'DELETE', auth: true }),
  getMyIdeas: () => request('/api/my-ideas', { auth: true }),
  toggleLike: (id) =>
    request(`/api/ideas/${id}/like`, { method: 'PATCH', auth: true }),

  // ---- comments ----
  getComments: (ideaId) => request(`/api/ideas/${ideaId}/comments`),
  addComment: (ideaId, text) =>
    request(`/api/ideas/${ideaId}/comments`, {
      method: 'POST',
      body: { text },
      auth: true,
    }),
  editComment: (commentId, text) =>
    request(`/api/comments/${commentId}`, {
      method: 'PUT',
      body: { text },
      auth: true,
    }),
  deleteComment: (commentId) =>
    request(`/api/comments/${commentId}`, {
      method: 'DELETE',
      auth: true,
    }),

  // ---- interactions ----
  getMyInteractions: () => request('/api/my-interactions', { auth: true }),

  // ---- bookmarks ----
  getBookmarks: () => request('/api/bookmarks', { auth: true }),
  toggleBookmark: (id) =>
    request(`/api/ideas/${id}/bookmark`, { method: 'PATCH', auth: true }),
};

export { API_URL };
