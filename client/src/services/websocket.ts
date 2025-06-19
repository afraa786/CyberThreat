import { io, Socket } from 'socket.io-client';
import { Message } from '../types';

class WebSocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  connect(sessionToken: string): void {
    const wsUrl = process.env.NODE_ENV === 'production' 
      ? 'wss://your-api-domain.com' 
      : 'ws://localhost:3001';

    this.socket = io(wsUrl, {
      auth: {
        token: sessionToken,
      },
      transports: ['websocket'],
      upgrade: false,
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket');
      this.emit('connect');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket');
      this.emit('disconnect');
    });

    this.socket.on('newMessage', (message: Message) => {
      this.emit('newMessage', message);
    });

    this.socket.on('error', (error: any) => {
      console.error('WebSocket error:', error);
      this.emit('error', error);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  sendMessage(message: string): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('sendMessage', { content: message });
    }
  }

  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => callback(data));
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const wsService = new WebSocketService();