// WebSocket service for lobby chat
export class LobbyChatService {
    constructor() {
      this.socket = null;
      this.messageHandlers = new Set();
      this.reconnectAttempts = 0;
      this.maxReconnectAttempts = 5;
    }
  
    connect() {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }
  
      const wsProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
      const wsUrl = `${wsProtocol}${window.location.host}/api/chat/lobby/?token=${token}`;
            
  
      this.socket = new WebSocket(wsUrl);
      this.setupEventHandlers();
    }
  
    setupEventHandlers() {
      this.socket.onopen = () => {
        console.log('Lobby chat connected');
        this.reconnectAttempts = 0;
      };
  
      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.messageHandlers.forEach(handler => handler(data));
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };
  
      this.socket.onclose = () => {
        console.log('Lobby chat disconnected');
        this.handleReconnect();
      };
  
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    }
  
    handleReconnect() {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
        setTimeout(() => this.connect(), delay);
      }
    }
  
    sendMessage(message) {
      if (this.socket?.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({
          message
        }));
      }
    }
  
    onMessage(handler) {
      this.messageHandlers.add(handler);
      return () => this.messageHandlers.delete(handler);
    }
  
    disconnect() {
      if (this.socket) {
        this.socket.close();
        this.socket = null;
      }
    }
  }
  
  // Create singleton instance
  export const lobbyChatService = new LobbyChatService();