import { API_CONFIG, getApiUrl, getAuthHeaders } from './config';

// Types for authentication
export interface RegisterData {
  email: string;
  name: string;
  password: string;
  confirm_password: string;
  is_company?: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface OTPData {
  email: string;
  otp: string;
}

export interface PasswordResetRequestData {
  email: string;
}

export interface PasswordResetData {
  email: string;
  otp: string;
  new_password: string;
}

export interface UserData {
  id: number;
  name: string;
  email: string;
  profile_image: string;
  is_staff: boolean;
  is_company: boolean;
  is_mentor: boolean;
  testimonial: any[];
  companies?: any[];
  userdetails?: any[];
  interview_selected?: any[];
  internship_under_review?: any[];
}

export interface AuthResponse {
  message?: string;
  jwt?: string;
}

// Authentication Service
class AuthService {
  // Register user
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.REGISTER), {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        let errorMessage = 'Registration failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result;
    } catch (error: any) {
      console.error('Registration fetch error:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to the server. Please check your internet connection.');
      }
      throw error;
    }
  }

  // Verify OTP
  async verifyOTP(data: OTPData): Promise<AuthResponse> {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.REGISTER), {
      method: 'PUT',
      headers: API_CONFIG.HEADERS,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'OTP verification failed');
    }

    return response.json();
  }

  // Resend OTP
  async resendOTP(email: string): Promise<AuthResponse> {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.RESEND_OTP), {
      method: 'POST',
      headers: API_CONFIG.HEADERS,
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to resend OTP');
    }

    return response.json();
  }

  // Login user
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.LOGIN), {
      method: 'POST',
      headers: API_CONFIG.HEADERS,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  }

  // Logout user
  async logout(token: string): Promise<AuthResponse> {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.LOGOUT), {
      method: 'POST',
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Logout failed');
    }

    return response.json();
  }

  // Request password reset
  async requestPasswordReset(data: PasswordResetRequestData): Promise<AuthResponse> {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.PASSWORD_RESET_REQUEST), {
      method: 'POST',
      headers: API_CONFIG.HEADERS,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Password reset request failed');
    }

    return response.json();
  }

  // Reset password
  async resetPassword(data: PasswordResetData): Promise<AuthResponse> {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.PASSWORD_RESET), {
      method: 'POST',
      headers: API_CONFIG.HEADERS,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Password reset failed');
    }

    return response.json();
  }

  // Get user data
  async getUserData(token: string): Promise<UserData> {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.USER_DATA), {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to get user data';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Get user data error:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to the server. Please check your internet connection.');
      }
      throw error;
    }
  }

  // Update user name
  async updateUserName(token: string, name: string): Promise<AuthResponse> {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.USER_DATA), {
      method: 'PATCH',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update user name');
    }

    return response.json();
  }

  // Delete user account
  async deleteUser(token: string): Promise<AuthResponse> {
    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.USER_DATA), {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete user account');
    }

    return response.json();
  }
}

// Export singleton instance
export const authService = new AuthService();
