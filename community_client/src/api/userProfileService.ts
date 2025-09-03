import { API_CONFIG, getAuthHeaders, getAuthMultipartHeaders } from './config';

// APE API Service (api-ape.crodlin.in)
export const apeService = {
  // Get current user details (companies, interviews, etc.)
  async getUser(token: string) {
    const response = await fetch(`${API_CONFIG.APE_API_SERVER}/api/user`, {
      method: 'GET',
      headers: getAuthHeaders(token),
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch user. Status: ${response.status}`);
    }
    return response.json();
  },

  // Download resume for a user
  async downloadResume(token: string, email: string) {
    const response = await fetch(`${API_CONFIG.APE_API_SERVER}/api/resume/${email}`, {
      method: 'GET',
      headers: getAuthHeaders(token),
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(`Failed to download resume. Status: ${response.status}`);
    }
    return response.blob();
  },

  // Update company basic fields (JSON)
  async updateCompany(token: string, companyId: number, data: Record<string, unknown>) {
    const response = await fetch(`${API_CONFIG.APE_API_SERVER}/api/companies/${companyId}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(token),
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to update company. Status: ${response.status}`);
    }
    return response.json();
  },

  // Upload company logo (multipart)
  async uploadCompanyLogo(token: string, companyId: number, logo: File) {
    const formData = new FormData();
    formData.append('logo', logo);
    const response = await fetch(`${API_CONFIG.APE_API_SERVER}/api/companies/${companyId}/`, {
      method: 'PATCH',
      headers: getAuthMultipartHeaders(token),
      credentials: 'include',
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`Failed to upload logo. Status: ${response.status}`);
    }
    return response.json();
  },

  // Create a new internship posting
  async createInternship(token: string, internshipData: Record<string, unknown>) {
    const response = await fetch(`${API_CONFIG.APE_API_SERVER}/api/internships/`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      credentials: 'include',
      body: JSON.stringify(internshipData),
    });
    if (!response.ok) {
      throw new Error(`Failed to post internship. Status: ${response.status}`);
    }
    return response.json();
  },

  // Update internship (e.g., set is_selected)
  async updateInternship(token: string, internshipId: number, payload: Record<string, unknown>) {
    const response = await fetch(`${API_CONFIG.APE_API_SERVER}/api/internships/${internshipId}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(token),
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`Failed to update internship. Status: ${response.status}`);
    }
    return response.json();
  },

  // Get company internships and applications
  async getCompanyInternships(token: string, companyId: number) {
    const response = await fetch(`${API_CONFIG.APE_API_SERVER}/api/companies/${companyId}/internships/`, {
      method: 'GET',
      headers: getAuthHeaders(token),
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(`Failed to get company internships. Status: ${response.status}`);
    }
    return response.json();
  },

  // Get company analytics data
  async getCompanyAnalytics(token: string, companyId: number) {
    const response = await fetch(`${API_CONFIG.APE_API_SERVER}/api/companies/${companyId}/analytics/`, {
      method: 'GET',
      headers: getAuthHeaders(token),
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(`Failed to get company analytics. Status: ${response.status}`);
    }
    return response.json();
  },

  // Get all internships for a company
  async getAllInternships(token: string) {
    const response = await fetch(`${API_CONFIG.APE_API_SERVER}/api/internships/`, {
      method: 'GET',
      headers: getAuthHeaders(token),
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(`Failed to get internships. Status: ${response.status}`);
    }
    return response.json();
  },

  // Get specific internship with applications
  async getInternshipDetails(token: string, internshipId: number) {
    const response = await fetch(`${API_CONFIG.APE_API_SERVER}/api/internships/${internshipId}/`, {
      method: 'GET',
      headers: getAuthHeaders(token),
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(`Failed to get internship details. Status: ${response.status}`);
    }
    return response.json();
  },

  // Update student selection for interview
  async selectStudentForInterview(token: string, applicationId: number) {
    const response = await fetch(`${API_CONFIG.APE_API_SERVER}/api/internship-applications/${applicationId}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(token),
      credentials: 'include',
      body: JSON.stringify({ is_selected: true }),
    });
    if (!response.ok) {
      throw new Error(`Failed to select student. Status: ${response.status}`);
    }
    return response.json();
  },
};

export type ApeUserResponse = any;
export type CompanyAnalytics = any;
export type InternshipData = any;
export type StudentApplication = any;

