import { chatService } from '../services/chat/chatService.js';
import { authService } from './api/authService.js';
import { webSocketService } from '../services/websocket/WebSocketService.js';
import { createChatMessageHandler } from '../services/chat/ChatMessageHandler.js';

export class WhatsAppState {
  constructor() {
    this.selectedChat = null;
    this.userId = null;
    this.chats = new Map();
    this.subscribers = new Set();
    this.messageHandler = createChatMessageHandler(this);
    webSocketService.connect();
  }

  async initialize() {
    try {
      const mockChats = await chatService.getChats();
      const user = await authService.getCurrentUser();

      this.userId = user.id;
      console.log('Current user:', user.id, user.username);

      mockChats.forEach(chat => {
        this.chats.set(chat.id, chat);
      });

    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  }

  async syncWithBackend() {
    try {
      await chatService.syncChats(Array.from(this.chats.values()));
    } catch (error) {
      console.error('Error syncing chats:', error);
    }
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  addNewChat(userId, userName = 'New User', avatar = '') {
    if (this.chats.has(userId)) {
      console.warn(`Chat with userId: ${userId} already exists.`);
      this.selectedChat = userId;
      this.notify();
      return;
    }

    this.chats.set(userId, {
      id: userId.toString(),
      user: {
        id: userId.toString(),
        name: userName,
        avatar: avatar || 'https://via.placeholder.com/40',
        status: 'Online'
      },
      messages: []
    });

    this.selectedChat = userId;
    this.notify();
    //console.log(`Created new chat with userId: ${userId}`);
  }

  notify() {
    this.subscribers.forEach(callback => callback());
  }

  selectChat(chatId) {
    this.selectedChat = chatId;
    //console.log('Selected chat:', this.getSelectedChat(), chatId);
    this.notify();
  }

  async sendMessage(content) {
    if (!this.selectedChat || !content.trim()) return null;

    const chat = Array.from(this.chats.values()).find(chat => chat.id === this.selectedChat);

    console.log('Selected chat:', chat);
    if (!chat) return null;

    const message = {
      id: Date.now().toString(),
      content: content.trim(),
      timestamp: new Date().toISOString(),
      senderId: 'self',
      status: 'sent'
    };

    chat.messages.push(message);
    this.notify();


    //console.log('Overall chats:');
    this.chats.forEach((chat, id) => {
        //console.log(`Chat ID: ${id}`, chat);
    });

    // this.syncWithBackend();
        
    const recipientId = chat.user.id;
    this.messageHandler.sendMessage(recipientId, content);

    return message;
  }

  getChats() {
    return Array.from(this.chats.values());
  }

  getChat(chatId) {
    return Array.from(this.chats.values()).find(chat => chat.id === chatId) || null;
  }

  getSelectedChat() {
    return this.selectedChat ? Array.from(this.chats.values()).find(chat => chat.id === this.selectedChat) : null;
  }

  destroy() {
    webSocketService.disconnect();
  }
}

