import { API_CONFIG, getApiUrl } from './config';

// Types for portfolio data
export interface Education {
  id: number;
  degree: string;
  field_of_study: string;
  University: string;
  location: string;
  start_date: string;
  end_date: string;
  current_grade?: number;
  user: number;
}

export interface ProjectLink {
  id: number;
  name: string;
  url: string;
  project: number;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  user: number;
  link?: ProjectLink[];
}

export interface Tool {
  id: number;
  name: string;
  tool_name: number;
}

export interface ToolName {
  id: number;
  name: string;
  user: number;
  tools?: Tool[];
}

export interface Certificate {
  id: number;
  name: string;
  issuing_organization: string;
  competition_battled: number;
  competition_won: number;
  credential_id?: string;
  credential_url?: string;
  user: number;
}

export interface UserDetails {
  id: number;
  name: string;
  email: string;
  phone_number?: string;
  about?: string;
  template?: number;
  profile_image?: string;
  education?: Education[];
  project?: Project[];
  certificate?: Certificate[];
  tool?: Tool[];
}

export interface PortfolioData {
  userDetails: UserDetails;
  toolNames: ToolName[];
}

// Helper function to get auth headers
const getAuthHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
});

export const portfolioService = {
  // Get portfolio data for a user
  async getPortfolio(email: string): Promise<PortfolioData> {
    const url = getApiUrl(API_CONFIG.PORTFOLIO.USER_DETAILS(email));
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch portfolio. Status: ${response.status}. Message: ${errorText}`);
    }

    const data = await response.json();

    // Transform the flat structure to the expected nested structure
    const transformedData: PortfolioData = {
      userDetails: {
        id: data.id,
        name: data.name || '',
        email: data.email || '',
        phone_number: data.phone_number || '',
        about: data.about || '',
        template: data.template,
        profile_image: data.profile_image || '',
        education: data.education || [],
        project: data.project || [],
        certificate: data.certificate || [],
        tool: data.tool || [],
      },
      toolNames: data.toolname || []
    };

    return transformedData;
  },

  // Update user details
  async updateUserDetails(token: string, email: string, data: Partial<UserDetails>): Promise<UserDetails> {
    const response = await fetch(getApiUrl(API_CONFIG.PORTFOLIO.USER_DETAILS(email)), {
      method: 'PATCH',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update user details. Status: ${response.status}`);
    }

    return response.json();
  },

  // Education CRUD operations
  async createEducation(token: string, data: Omit<Education, 'id'>): Promise<Education> {
    const response = await fetch(getApiUrl(API_CONFIG.PORTFOLIO.EDUCATION), {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create education. Status: ${response.status}`);
    }

    return response.json();
  },

  async updateEducation(token: string, id: number, data: Partial<Education>): Promise<Education> {
    const response = await fetch(getApiUrl(`${API_CONFIG.PORTFOLIO.EDUCATION}${id}/`), {
      method: 'PATCH',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update education. Status: ${response.status}`);
    }

    return response.json();
  },

  async deleteEducation(token: string, id: number): Promise<void> {
    const response = await fetch(getApiUrl(`${API_CONFIG.PORTFOLIO.EDUCATION}${id}/`), {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete education. Status: ${response.status}`);
    }
  },

  // Project CRUD operations
  async createProject(token: string, data: Omit<Project, 'id'>): Promise<Project> {
    const response = await fetch(getApiUrl(API_CONFIG.PORTFOLIO.PROJECTS), {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create project. Status: ${response.status}`);
    }

    return response.json();
  },

  async updateProject(token: string, id: number, data: Partial<Project>): Promise<Project> {
    const response = await fetch(getApiUrl(`${API_CONFIG.PORTFOLIO.PROJECTS}${id}/`), {
      method: 'PATCH',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update project. Status: ${response.status}`);
    }

    return response.json();
  },

  async deleteProject(token: string, id: number): Promise<void> {
    const response = await fetch(getApiUrl(`${API_CONFIG.PORTFOLIO.PROJECTS}${id}/`), {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete project. Status: ${response.status}`);
    }
  },

  // Project Link CRUD operations
  async createProjectLink(token: string, data: Omit<ProjectLink, 'id'>): Promise<ProjectLink> {
    const response = await fetch(getApiUrl(API_CONFIG.PORTFOLIO.LINKS), {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create project link. Status: ${response.status}`);
    }

    return response.json();
  },

  async updateProjectLink(token: string, id: number, data: Partial<ProjectLink>): Promise<ProjectLink> {
    const response = await fetch(getApiUrl(`${API_CONFIG.PORTFOLIO.LINKS}${id}/`), {
      method: 'PATCH',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update project link. Status: ${response.status}`);
    }

    return response.json();
  },

  async deleteProjectLink(token: string, id: number): Promise<void> {
    const response = await fetch(getApiUrl(`${API_CONFIG.PORTFOLIO.LINKS}${id}/`), {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete project link. Status: ${response.status}`);
    }
  },

  // Tool Name CRUD operations
  async createToolName(token: string, data: Omit<ToolName, 'id'>): Promise<ToolName> {
    const response = await fetch(getApiUrl(API_CONFIG.PORTFOLIO.TOOL_NAMES), {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create tool name. Status: ${response.status}`);
    }

    return response.json();
  },

  async updateToolName(token: string, id: number, data: Partial<ToolName>): Promise<ToolName> {
    const response = await fetch(getApiUrl(`${API_CONFIG.PORTFOLIO.TOOL_NAMES}${id}/`), {
      method: 'PATCH',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update tool name. Status: ${response.status}`);
    }

    return response.json();
  },

  async deleteToolName(token: string, id: number): Promise<void> {
    const response = await fetch(getApiUrl(`${API_CONFIG.PORTFOLIO.TOOL_NAMES}${id}/`), {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete tool name. Status: ${response.status}`);
    }
  },

  // Tool CRUD operations
  async createTool(token: string, data: Omit<Tool, 'id'>): Promise<Tool> {
    const response = await fetch(getApiUrl(API_CONFIG.PORTFOLIO.TOOLS), {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create tool. Status: ${response.status}`);
    }

    return response.json();
  },

  async updateTool(token: string, id: number, data: Partial<Tool>): Promise<Tool> {
    const response = await fetch(getApiUrl(`${API_CONFIG.PORTFOLIO.TOOLS}${id}/`), {
      method: 'PATCH',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update tool. Status: ${response.status}`);
    }

    return response.json();
  },

  async deleteTool(token: string, id: number): Promise<void> {
    const response = await fetch(getApiUrl(`${API_CONFIG.PORTFOLIO.TOOLS}${id}/`), {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete tool. Status: ${response.status}`);
    }
  },
};
