import { WhatsAppState } from '../../services/WhatsAppState.js';
import { Message } from '../../views/components/whatsapp/Message.js';
import { ChatItem } from '../../views/components/whatsapp/ChatItem.js';

const whatsAppState = new WhatsAppState();

export async function initWhatsAppHandlers() {
    try {
        await whatsAppState.initialize();
    } catch (error) {
        console.error('Error initializing WhatsAppState:', error);
    }

    const chatList = document.querySelector('.chat-list');
    const chatMessages = document.querySelector('.chat-messages');
    const messageInput = document.querySelector('.message-input');
    const sendButton = document.querySelector('.send-button');
    const searchInput = document.getElementById('searchMessages');
    const chatHeader = document.querySelector('.chat-header');


    // Handle clicks that might start a new chat or toggle block
    document.addEventListener('click', (e) => {
        const messageBtn = e.target.closest('[data-message-user]');
        if (messageBtn) {
            const userId = messageBtn.dataset.messageUser;
            const userName = messageBtn.dataset.userName;
            console.log('Start chat with:', userId, userName);
            startNewChat(userId, userName);
        }

        // Handle the block/unblock button
        const blockBtn = e.target.closest('#toggleBlockBtn');
        if (blockBtn) {
            e.preventDefault();
            e.stopPropagation();

            console.log('Block/unblock user');

            const selectedChat = whatsAppState.getSelectedChat();
            console.log('Block/unblock user here:', selectedChat);
            if (selectedChat) {
                console.log('Toggling block for:', selectedChat.id);
                whatsAppState.toggleBlockUser(selectedChat.id);
                const messageInput = document.querySelector('.message-input');
                if (messageInput) {
                    messageInput.disabled = true;
                }
            }
        }
    });

    function startNewChat(userId, userName) {
        if (whatsAppState.getChat(userId)) {
            whatsAppState.selectChat(userId);
        } else {
            whatsAppState.addNewChat(userId, userName);
        }
    
        window.location.hash = '#/whatsapp';
    
        let attemptCount = 0;
        const maxAttempts = 10;
        const retryDelay = 300;
    
        const intervalId = setInterval(() => {
            const chatHeader = document.querySelector('.chat-header');
            attemptCount++;
    
            // Once we find the element or exceed max attempts, clear the interval
            if (chatHeader || attemptCount >= maxAttempts) {
                clearInterval(intervalId);
    
                if (!chatHeader) {
                    console.warn('Chat header not found after max attempts');
                    return;
                }
    
                // If we do find the chatHeader, update it
                const selectedChat = whatsAppState.getSelectedChat();
                if (!selectedChat || !selectedChat.user) {
                    chatHeader.innerHTML = `
                        <div class="text-center text-muted p-3">
                            Select a chat to start messaging
                        </div>
                    `;
                    return;
                }
    
                // Note: The "Block/Unblock User" text is handled in updateChatHeader()
                // but we can also handle it here if you prefer.
                chatHeader.innerHTML = `
                    <div class="d-flex align-items-center p-3">
                        <img
                            src="${selectedChat.user.avatar}"
                            class="rounded-circle me-2"
                            alt="${selectedChat.user.name}"
                            width="40"
                            height="40"
                        />
                        <div>
                            <h6 class="mb-0">${selectedChat.user.name}</h6>
                            <small class="text-muted">${selectedChat.user.status}</small>
                        </div>
                        <!-- Dropdown aligned to the right (optional) -->
                        <div class="dropdown ms-auto" id="chatActions">
                            <button 
                                class="btn btn-light rounded-circle" 
                                type="button" 
                                data-bs-toggle="dropdown"
                            >
                                <i class="bi bi-three-dots-vertical"></i>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li>
                                    <button class="dropdown-item" id="toggleBlockBtn">
                                        <i class="bi bi-slash-circle me-2"></i>
                                        <span>Block User</span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                `;
            }
        }, retryDelay);
    }    

    function updateChatList() {
        if (!chatList) return;

        const chats = whatsAppState.getChats();
        
        // Render the chat items
        chatList.innerHTML = chats
            .map((chat) =>
                ChatItem({
                    user: chat.user,
                    lastMessage: chat.messages[chat.messages.length - 1],
                    unreadCount: 0,
                    isActive: chat.id === whatsAppState.selectedChat,
                })
            )
            .join('');

        // Add click handlers
        chatList.querySelectorAll('.chat-item').forEach((item) => {
            item.addEventListener('click', () => {
                const chatId = item.dataset.userId;
                whatsAppState.selectChat(chatId);
            });
        });
    }

    function updateChatMessages() {
        if (!chatMessages) return;

        const selectedChat = whatsAppState.getSelectedChat();

        if (!selectedChat) {
            chatMessages.innerHTML = `
                <div class="text-center text-muted p-4">
                    Select a chat to view messages
                </div>
            `;
            return;
        }

        // If user is blocked, optionally show a banner
        let blockedBanner = '';
        if (selectedChat.isBlocked) {
            blockedBanner = `
                <div class="alert alert-warning text-center m-3">
                    <i class="bi bi-slash-circle me-2"></i>
                    You have blocked this user. Unblock to send messages.
                </div>
            `;
        }

        // Render messages
        chatMessages.innerHTML = blockedBanner + selectedChat.messages
            .map((msg) =>
                Message({
                    content: msg.content,
                    timestamp: msg.timestamp,
                    isSelf: msg.senderId === 'self',
                    status: msg.status
                })
            )
            .join('');

        // Auto-scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Call updateChatMessages every 3 seconds
    setInterval(updateChatMessages, 3000);

    function updateChatHeader() {
        if (!chatHeader) return;

        const selectedChat = whatsAppState.getSelectedChat();

        if (!selectedChat) {
            chatHeader.innerHTML = `
                <div class="text-center text-muted p-3">
                    Select a chat to start messaging
                </div>
            `;
            return;
        }

        // Decide whether to show "Block" or "Unblock"
        const blockBtnLabel = selectedChat.isBlocked ? 'Unblock User' : 'Block User';
        const blockBtnIcon = selectedChat.isBlocked ? 'bi-slash-circle-fill' : 'bi-slash-circle';

        chatHeader.innerHTML = `
            <div class="d-flex align-items-center p-3">
                <img
                    src="${selectedChat.user.avatar}"
                    class="rounded-circle me-2"
                    alt="${selectedChat.user.name}"
                    width="40"
                    height="40"
                />
                <div>
                    <h6 class="mb-0">${selectedChat.user.name}
                        ${
                            selectedChat.isBlocked
                                ? `<i class="bi bi-slash-circle text-muted ms-2"></i>`
                                : ''
                        }
                    </h6>
                    <small class="text-muted">${selectedChat.user.status}</small>
                </div>
                <!-- Dropdown aligned to the right (optional) -->
                <div class="dropdown ms-auto" id="chatActions">
                    <button 
                        class="btn btn-light rounded-circle" 
                        type="button" 
                        data-bs-toggle="dropdown"
                    >
                        <i class="bi bi-three-dots-vertical"></i>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li>
                            <button class="dropdown-item" id="toggleBlockBtn">
                                <i class="${blockBtnIcon} me-2"></i>
                                <span>${blockBtnLabel}</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        `;
    }

    function handleSendMessage() {
        if (!messageInput) return;
        
        const content = messageInput.value.trim();
        const selectedChat = whatsAppState.getSelectedChat();

        // Prevent sending if blocked
        if (selectedChat?.isBlocked) {
            console.warn('Cannot send message to a blocked user.');
            return;
        }

        if (content) {
            whatsAppState.sendMessage(content);
            messageInput.value = '';
        }
    }

    function handleSearch(searchTerm) {
        const items = chatList?.querySelectorAll('.chat-item');
        if (!items) return;

        const term = searchTerm.toLowerCase();
        items.forEach((item) => {
            const name = item.querySelector('h6')?.textContent.toLowerCase() || '';
            const message = item.querySelector('small')?.textContent.toLowerCase() || '';
            const isVisible = name.includes(term) || message.includes(term);
            item.style.display = isVisible ? 'block' : 'none';
        });
    }

    // Event listeners
    sendButton?.addEventListener('click', handleSendMessage);

    messageInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });
    searchInput?.addEventListener('input', (e) => {
        handleSearch(e.target.value);
    });

    // Subscribe to state changes
    whatsAppState.subscribe(() => {
        // Re-render whenever state changes
        updateChatList();
        updateChatMessages();
        updateChatHeader();
    });

    // Initial render
    updateChatList();
    updateChatMessages();
    updateChatHeader();
}













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
    this.blockedUsers = new Set();
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
    this.blockedUsers = new Set();
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

  toggleBlockUser(userId) {
    console.log('Blocking user:', userId); 
    if (this.blockedUsers.has(userId)) {
        // this.blockedUsers.delete(userId);
    } else {
        this.blockedUsers.add(userId);
    }
    console.log('Blocked users:', this.blockedUsers); 
    this.notify();
  }

  isBlocked(userId) {
      return this.blockedUsers.has(userId);
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

export class ChatState {
    constructor() {
        this.currentChat = null;
        this.messages = new Map();
        this.users = new Map(mockUsers.map(user => [user.id, user]));
        this.blockedUsers = new Set();
        this.subscribers = new Set();
        this.initializeMockData();
    }

    initializeMockData() {
        mockMessages.forEach(message => {
            const chatId = message.senderId === 'currentUser' ? message.recipientId : message.senderId;
            if (!this.messages.has(chatId)) {
                this.messages.set(chatId, []);
            }
            this.messages.get(chatId).push(message);
        });
    }

    subscribe(callback) {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }

    notify() {
        this.subscribers.forEach(callback => callback());
    }

    setCurrentChat(userId) {
        this.currentChat = userId;
        this.markMessagesAsRead(userId);
        this.notify();
    }

    toggleBlockUser(userId) {
        if (this.blockedUsers.has(userId)) {
            this.blockedUsers.delete(userId);
        } else {
            this.blockedUsers.add(userId);
        }
        this.notify();
    }

    isBlocked(userId) {
        return this.blockedUsers.has(userId);
    }

    addMessage(message) {
        const chatId = message.senderId === 'currentUser' ? message.recipientId : message.senderId;
        
        // Don't allow sending messages to blocked users
        if (message.senderId === 'currentUser' && this.isBlocked(chatId)) {
            return;
        }

        if (!this.messages.has(chatId)) {
            this.messages.set(chatId, []);
        }
        this.messages.get(chatId).push(message);
        
        // Simulate reply only if user is not blocked
        if (message.senderId === 'currentUser' && !this.isBlocked(chatId)) {
            setTimeout(() => {
                const reply = {
                    id: Date.now().toString(),
                    senderId: chatId,
                    recipientId: 'currentUser',
                    content: mockReplies[Math.floor(Math.random() * mockReplies.length)],
                    timestamp: new Date().toISOString(),
                    status: 'delivered'
                };
                this.addMessage(reply);
            }, 1000);
        }

        this.notify();
    }

    markMessagesAsRead(userId) {
        const messages = this.messages.get(userId) || [];
        messages.forEach(msg => {
            if (msg.recipientId === 'currentUser' && msg.status === 'delivered') {
                msg.status = 'read';
            }
        });
    }

    getChats() {
        return Array.from(this.messages.entries()).map(([userId, messages]) => ({
            user: this.users.get(userId),
            lastMessage: messages[messages.length - 1],
            unreadCount: this.getUnreadCount(userId),
            isBlocked: this.isBlocked(userId)
        }));
    }

    getCurrentChat() {
        if (!this.currentChat) return null;
        return {
            user: this.users.get(this.currentChat),
            messages: this.messages.get(this.currentChat) || [],
            isBlocked: this.isBlocked(this.currentChat)
        };
    }

    getUnreadCount(userId) {
        const messages = this.messages.get(userId) || [];
        return messages.filter(msg => 
            msg.recipientId === 'currentUser' && 
            msg.status === 'delivered'
        ).length;
    }
}

