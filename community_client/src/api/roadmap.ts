import { API_CONFIG, getApiUrl, getAuthHeaders } from './config';

// Roadmap API service
export const roadmapService = {
  // Get user roadmaps
  async getUserRoadmaps(email: string) {
    try {
      const response = await fetch(`${API_CONFIG.MODEL_API_SERVER}/user-roadmaps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user roadmaps');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user roadmaps:', error);
      throw error;
    }
  },

  // Check if input is a valid response
  async isResponse(prompt: string) {
    try {
      const response = await fetch(`${API_CONFIG.MODEL_API_SERVER}/is-response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to check response');
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking response:', error);
      throw error;
    }
  },

  // Generate first component of roadmap
  async generateRoadmapFirstComponent(inputValue: string, email: string) {
    try {
      const response = await fetch(`${API_CONFIG.MODEL_API_SERVER}/generate-roadmap-first-component`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input_value: inputValue,
          email: email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate roadmap first component');
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating roadmap first component:', error);
      throw error;
    }
  },

  // Generate full roadmap
  async generateRoadmapAll(roadmapId: string) {
    try {
      const response = await fetch(`${API_CONFIG.MODEL_API_SERVER}/generate-roadmap-all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: roadmapId }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate full roadmap');
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating full roadmap:', error);
      throw error;
    }
  },

  // Psychological chat bot
  async psychologicalChat(email: string, userInput: string) {
    try {
      const response = await fetch(`${API_CONFIG.CHAT_BOTS_API_SERVER}/api/psychology_chat_bot/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          user_input: userInput,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get psychological response');
      }

      return await response.json();
    } catch (error) {
      console.error('Error with psychological chat:', error);
      throw error;
    }
  },

  // Generate suggested prompt
  async makePrompt(email: string) {
    try {
      const response = await fetch(`${API_CONFIG.CHAT_BOTS_API_SERVER}/api/make_prompt/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate prompt');
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating prompt:', error);
      throw error;
    }
  },

  // Delete conversation
  async deleteConversation(email: string) {
    try {
      const response = await fetch(`${API_CONFIG.CHAT_BOTS_API_SERVER}/api/delete_conversation/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete conversation');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  },
};

// Types for roadmap data
export interface RoadmapComponent {
  name: string;
  description: string;
  // Add other component properties as needed
}

export interface RoadmapData {
  id: string;
  name: string;
  roadmap_json: {
    roadmap_components: RoadmapComponent[];
  };
  // Add other roadmap properties as needed
}

export interface IsResponseData {
  response: string;
}

export interface RoadmapGenerationData {
  roadmap_id: string;
  // Add other generation properties as needed
}

export interface PsychologicalChatData {
  bot_response: string;
  // Add other chat properties as needed
}

export interface PromptData {
  prompt: string;
  // Add other prompt properties as needed
}
