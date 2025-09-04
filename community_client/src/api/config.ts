// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:9000',

  // Portfolio endpoints

  COMMUNITY: {
    LIST: '/api/community/communities/',
    DETAIL: (id: number | string) => `/api/community/communities/${id}/`,
    POSTS: '/api/community/posts/',
    POST_DETAIL: (id: number | string) => `/api/community/posts/${id}/`,
    FILES: '/api/community/files/',
    VOTES: '/api/community/votes/',
    COMMENTS: '/api/community/comments/',
    REPLIES: '/api/community/replies/',
    COMMENT_VOTES: '/api/community/comment-votes/',
    COMMENT_REPLY_VOTES: '/api/community/comment-reply-votes/',
    SAVED_POSTS: '/api/community/saved-posts/', 
    COMMUNITY_USERS: '/api/community/community-users/',
    ROLE_MANAGEMENT: (communityId: number | string) => `/api/community/communities/${communityId}/roles/`,
    USER_ACTIVITY: '/api/community/users/activity/',
  },

  // Headers
  HEADERS: {
    'Content-Type': 'application/json',
  },
} as const;

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get headers with auth token
export const getAuthHeaders = (token?: string) => {
  const headers: Record<string, string> = { ...API_CONFIG.HEADERS };
  if (token) {
    headers['Authorization'] = token; // Server expects token without Bearer
  }
  return headers;
};

export const getAuthMultipartHeaders = (token?: string) => {
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = token;
  }
  return headers;
};