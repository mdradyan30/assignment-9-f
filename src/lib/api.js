// Centralized API helper with cookie-based JWT authentication support.
// All requests include credentials to allow HTTP-Only cookies to be sent/received.

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Store reference to 401 handler (set by AuthContext)
let handle401Error = null;

export function set401Handler(callback) {
  handle401Error = callback;
}

async function request(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  try {
    const res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include', // Include HTTP-Only cookies in all requests
    });

    let data;
    try {
      data = await res.json();
    } catch {
      data = {};
    }

    // Handle 401 Unauthorized - user session expired or invalid
    if (res.status === 401) {
      console.warn(`[API 401] Unauthorized on ${method} ${path}`);
      if (handle401Error) {
        handle401Error();
      }
      throw new Error('Unauthorized - Please log in again');
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
  logout: () =>
    request('/api/auth/logout', { method: 'POST' }),

  // ---- profile ----
  getProfile: () => request('/api/users/me'),
  updateProfile: (payload) =>
    request('/api/users/me', { method: 'PATCH', body: payload }),

  // ---- ideas ----
  getIdeas: (queryString = '') => request(`/api/ideas${queryString}`),
  getTrending: (limit = 6) => request(`/api/ideas/trending?limit=${limit}`),
  getRecent: (limit = 6) => request(`/api/ideas?sort=-createdAt&limit=${limit}`),
  getIdea: (id) => request(`/api/ideas/${id}`),
  createIdea: (payload) =>
    request('/api/ideas', { method: 'POST', body: payload }),
  updateIdea: (id, payload) =>
    request(`/api/ideas/${id}`, { method: 'PUT', body: payload }),
  deleteIdea: (id) =>
    request(`/api/ideas/${id}`, { method: 'DELETE' }),
  getMyIdeas: () => request('/api/my-ideas'),
  toggleLike: (id) =>
    request(`/api/ideas/${id}/like`, { method: 'PATCH' }),

  // ---- comments ----
  getComments: (ideaId) => request(`/api/ideas/${ideaId}/comments`),
  addComment: (ideaId, text) =>
    request(`/api/ideas/${ideaId}/comments`, {
      method: 'POST',
      body: { text },
    }),
  editComment: (commentId, text) =>
    request(`/api/comments/${commentId}`, {
      method: 'PUT',
      body: { text },
    }),
  deleteComment: (commentId) =>
    request(`/api/comments/${commentId}`, {
      method: 'DELETE',
    }),

  // ---- interactions ----
  getMyInteractions: () => request('/api/my-interactions'),

  // ---- bookmarks ----
  getBookmarks: () => request('/api/bookmarks'),
  toggleBookmark: (id) =>
    request(`/api/ideas/${id}/bookmark`, { method: 'PATCH' }),
};

export { API_URL };
