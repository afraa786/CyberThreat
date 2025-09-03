import { API_CONFIG, getApiUrl, getAuthHeaders, getAuthMultipartHeaders } from './config';

// Types
export interface CommunityData {
  id?: number;
  name: string;
  description?: string;
}

export interface PostData {
  id?: number;
  title: string;
  community: number;
  content: string;
}

export interface CommentData {
  id?: number;
  post: number;
  content: string;
}

export interface ReplyData {
  id?: number;
  comment: number;
  content: string;
}

export interface VoteData {
  id?: number;
  post?: number;
  value: number; // 1 or -1
}

export interface CommentVoteData {
  id?: number;
  comment: number;
  value: number; // 1 or -1
}

export interface ReplyVoteData {
  id?: number;
  reply: number;
  value: number; // 1 or -1
}

export interface SavePostData {
  id?: number;
  post: number;
}

export interface CommunityUserRoleData {
  user_id: number;
  role: 'member' | 'admin' | 'super_admin';
}

// Community Service
class CommunityService {
  // -----------------------
  // Communities
  // -----------------------
  async getCommunities(token: string) {
    const response = await fetch(getApiUrl(API_CONFIG.COMMUNITY.LIST), {
      headers: getAuthHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to fetch communities');
    return response.json();
  }

  async getCommunity(token: string, id: number | string) {
    const response = await fetch(getApiUrl(API_CONFIG.COMMUNITY.DETAIL(id)), {
      headers: getAuthHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to fetch community');
    return response.json();
  }

  async createCommunity(token: string, data: CommunityData, profilePicture?: File) {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    if (profilePicture) formData.append("profile_picture", profilePicture);
  
    const response = await fetch(getApiUrl(API_CONFIG.COMMUNITY.LIST), {
      method: "POST",
      headers: getAuthMultipartHeaders(token),
      body: formData,
    });
  
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Backend error:", errorData);
      throw new Error("Failed to create community");
    }
  
    return response.json();
  }

  async updateCommunity(token: string, id: number, data: Partial<CommunityData>, profilePicture?: File) {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (profilePicture) formData.append('profile_picture', profilePicture);

    const response = await fetch(getApiUrl(API_CONFIG.COMMUNITY.DETAIL(id)), {
      method: 'PUT',
      headers: getAuthMultipartHeaders(token),
      body: formData,
    });

    if (!response.ok) throw new Error('Failed to update community');
    return response.json();
  }

  async deleteCommunity(token: string, id: number) {
    const response = await fetch(getApiUrl(API_CONFIG.COMMUNITY.DETAIL(id)), {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to delete community');
    return true;
  }

  // -----------------------
  // Posts
  // -----------------------
  async getPosts(token: string) {
    const response = await fetch(getApiUrl(API_CONFIG.COMMUNITY.POSTS), {
      headers: getAuthHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to fetch posts');
    return response.json();
  }

  async createPost(token: string, data: PostData) {
    const response = await fetch(getApiUrl(API_CONFIG.COMMUNITY.POSTS), {
      method: "POST",
      headers: getAuthHeaders(token), // JSON headers only
      body: JSON.stringify({
        community: data.community,
        title: data.title,
        content: data.content,
      }),
    });
  
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Backend error (create post):", errorData);
      throw new Error("Failed to create post");
    }
  
    return response.json();
  }

  // 🔥 New method: upload files separately
  async uploadPostFiles(token: string, postId: number, files: File[]) {
    const formData = new FormData();
    formData.append("post", postId.toString());
    files.forEach((file) => formData.append("files", file));

    const response = await fetch(getApiUrl(API_CONFIG.COMMUNITY.FILES), {
      method: "POST",
      headers: getAuthMultipartHeaders(token),
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Backend error (upload files):", errorData);
      throw new Error("Failed to upload post files");
    }

    return response.json();
  }

  async listFiles(token: string) {
    const response = await fetch(getApiUrl(API_CONFIG.COMMUNITY.FILES), {
      headers: getAuthMultipartHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to list files');
    return response.json();
  }

  async updatePost(token: string, id: number, data: Partial<PostData>) {
    const response = await fetch(getApiUrl(API_CONFIG.COMMUNITY.POST_DETAIL(id)), {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update post');
    return response.json();
  }

  async deletePost(token: string, id: number) {
    const response = await fetch(getApiUrl(API_CONFIG.COMMUNITY.POST_DETAIL(id)), {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to delete post');
    return true;
  }

  // -----------------------
  // Comments & Replies
  // -----------------------
  async listComments(token: string) {
    const response = await fetch(getApiUrl(API_CONFIG.COMMUNITY.COMMENTS), {
      headers: getAuthHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to list comments');
    return response.json();
  }
  async createComment(token: string, data: CommentData) {
    const response = await fetch(getApiUrl(API_CONFIG.COMMUNITY.COMMENTS), {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create comment');
    return response.json();
  }

  async deleteComment(token: string, id: number) {
    const response = await fetch(getApiUrl(`${API_CONFIG.COMMUNITY.COMMENTS}${id}/`), {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to delete comment');
    return true;
  }

  async createReply(token: string, data: ReplyData) {
    const response = await fetch(getApiUrl(API_CONFIG.COMMUNITY.REPLIES), {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create reply');
    return response.json();
  }

  async listReplies(token: string) {
    const response = await fetch(getApiUrl(API_CONFIG.COMMUNITY.REPLIES), {
      headers: getAuthHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to list replies');
    return response.json();
  }

  async deleteReply(token: string, id: number) {
    const response = await fetch(getApiUrl(`${API_CONFIG.COMMUNITY.REPLIES}${id}/`), {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to delete reply');
    return true;
  }

  // -----------------------
  // Votes
  // -----------------------
  async votePost(token: string, data: VoteData) {
    const response = await fetch(getApiUrl(API_CONFIG.COMMUNITY.VOTES), {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to vote post');
    return response.json();
  }

  async updatePostVote(token: string, id: number, value: number) {
    const response = await fetch(getApiUrl(`${API_CONFIG.COMMUNITY.VOTES}${id}/`), {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ value }),
    });
    if (!response.ok) throw new Error('Failed to update vote');
    return response.json();
  }

  async deletePostVote(token: string, id: number) {
    const response = await fetch(getApiUrl(`${API_CONFIG.COMMUNITY.VOTES}${id}/`), {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to delete vote');
    return true;
  }

  async voteComment(token: string, data: CommentVoteData) {
    const response = await fetch(getApiUrl(API_CONFIG.COMMUNITY.COMMENT_VOTES), {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to vote comment');
    return response.json();
  }

  async updateCommentVote(token: string, id: number, value: number) {
    const response = await fetch(getApiUrl(`${API_CONFIG.COMMUNITY.COMMENT_VOTES}${id}/`), {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ value }),
    });
    if (!response.ok) throw new Error('Failed to update comment vote');
    return response.json();
  }

  async deleteCommentVote(token: string, id: number) {
    const response = await fetch(getApiUrl(`${API_CONFIG.COMMUNITY.COMMENT_VOTES}${id}/`), {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to delete comment vote');
    return true;
  }

  async voteReply(token: string, data: ReplyVoteData) {
    const response = await fetch(getApiUrl(API_CONFIG.COMMUNITY.COMMENT_REPLY_VOTES), {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to vote reply');
    return response.json();
  }

  async updateReplyVote(token: string, id: number, value: number) {
    const response = await fetch(getApiUrl(`${API_CONFIG.COMMUNITY.COMMENT_REPLY_VOTES}${id}/`), {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ value }),
    });
    if (!response.ok) throw new Error('Failed to update reply vote');
    return response.json();
  }

  async deleteReplyVote(token: string, id: number) {
    const response = await fetch(getApiUrl(`${API_CONFIG.COMMUNITY.COMMENT_REPLY_VOTES}${id}/`), {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to delete reply vote');
    return true;
  }

  // -----------------------
  // Saved Posts
  // -----------------------
  async savePost(token: string, data: SavePostData) {
    const response = await fetch(getApiUrl(API_CONFIG.COMMUNITY.SAVED_POSTS), {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to save post');
    return response.json();
  }

  async deleteSavedPost(token: string, id: number) {
    const response = await fetch(getApiUrl(`${API_CONFIG.COMMUNITY.SAVED_POSTS}${id}/`), {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to delete saved post');
    return true;
  }

  async listSavedPosts(token: string) {
    const response = await fetch(getApiUrl(API_CONFIG.COMMUNITY.SAVED_POSTS), {
      headers: getAuthHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to fetch saved posts');
    return response.json();
  }

  // -----------------------
  // Role Management
  // -----------------------
  async assignRole(token: string, communityId: number, data: CommunityUserRoleData) {
    const response = await fetch(getApiUrl(API_CONFIG.COMMUNITY.ROLE_MANAGEMENT(communityId)), {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to assign role');
    return response.json();
  }

  // -----------------------
  // Community Users (Join/Leave/List)
  // -----------------------
  async joinCommunity(token: string, communityId: number) {
    const response = await fetch(getApiUrl(API_CONFIG.COMMUNITY.COMMUNITY_USERS), {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ community: communityId, role: 'member' }),
    });
    if (!response.ok) throw new Error('Failed to join community');
    return response.json();
  }

  async leaveCommunity(token: string, membershipId: number) {
    const response = await fetch(getApiUrl(`${API_CONFIG.COMMUNITY.COMMUNITY_USERS}${membershipId}/`), {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to leave community');
    return true;
  }

  async listCommunityUsers(token: string) {
    const response = await fetch(getApiUrl(API_CONFIG.COMMUNITY.COMMUNITY_USERS), {
      headers: getAuthHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to fetch community users');
    return response.json();
  }

  // -----------------------
  // User Activity
  // -----------------------
  async getUserActivity(token: string) {
    const response = await fetch(getApiUrl(API_CONFIG.COMMUNITY.USER_ACTIVITY), {
      headers: getAuthHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to fetch user activity');
    return response.json();
  }
}

// Export singleton instance
export const communityService = new CommunityService();
