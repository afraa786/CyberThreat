import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
// import { ChatMessage } from './types'; // Assuming you have a types file for ChatMessage
// import { sendMessageREST } from './api'; // Assuming you have an API service for REST calls


export interface ChatMessage {
  id?: string;
  sender: string;
  content: string;
  timestamp: string;
  type?: 'message' | 'join' | 'leave';
}

export class WebSocketService {
  private stompClient: Client | null = null;
  private messageCallback: ((message: ChatMessage) => void) | null = null;
  private connectionCallback: ((connected: boolean) => void) | null = null;

  constructor() {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('/ws'),
      connectHeaders: {},
      debug: (str) => {
        console.log('[STOMP Debug]:', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.stompClient.onConnect = () => {
      console.log('Connected to WebSocket');
      this.connectionCallback?.(true);
      
      // Subscribe to group messages
      this.stompClient?.subscribe('/topic/group', (message) => {
        try {
          const chatMessage: ChatMessage = JSON.parse(message.body);
          this.messageCallback?.(chatMessage);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      });
    };

    this.stompClient.onStompError = (frame) => {
      console.error('Broker reported error:', frame.headers['message']);
      console.error('Additional details:', frame.body);
      this.connectionCallback?.(false);
    };

    this.stompClient.onDisconnect = () => {
      console.log('Disconnected from WebSocket');
      this.connectionCallback?.(false);
    };
  }

  connect(): void {
    if (this.stompClient && !this.stompClient.connected) {
      this.stompClient.activate();
    }
  }

  disconnect(): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.deactivate();
    }
  }

  sendMessage(message: ChatMessage): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination: '/app/sendMessage',
        body: JSON.stringify(message),
      });
    } else {
      console.error('WebSocket is not connected');
    }
  }

  sendNewUser(username: string): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination: '/app/newUser',
        body: JSON.stringify({ 
          sender: username, 
          content: `${username} joined the chat`, 
          timestamp: new Date().toISOString(),
          type: 'join'
        }),
      });
    } else {
      console.error('WebSocket is not connected');
    }
  }

  onMessage(callback: (message: ChatMessage) => void): void {
    this.messageCallback = callback;
  }

  onConnectionChange(callback: (connected: boolean) => void): void {
    this.connectionCallback = callback;
  }

  isConnected(): boolean {
    return this.stompClient?.connected || false;
  }
}

// REST API service
export const sendMessageREST = async (message: ChatMessage): Promise<void> => {
  try {
    const response = await fetch('/api/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error sending message via REST:', error);
    throw error;
  }
};