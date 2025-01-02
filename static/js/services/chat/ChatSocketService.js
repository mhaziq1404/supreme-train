import { WebSocketClient } from '../websocket/WebSocketClient.js';

export class ChatSocketService {
    constructor() {

        const wsProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
        const host = window.location.host;
        
        const wsUrl = `${wsProtocol}${host}/api/chat/${this.chatroomName}/?token=${token}`;
        this.client = new WebSocketClient(wsUrl);
        this.messageHandlers = new Set();
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        this.client.on('message', (message) => {
            this.messageHandlers.forEach(handler => handler(message));
        });

        this.client.on('connection', (status) => {
            console.log('Chat connection status:', status);
        });
    }

    connect() {
        this.client.connect();
    }

    sendMessage(message) {
        this.client.send('message', message);
    }

    onMessage(handler) {
        this.messageHandlers.add(handler);
        return () => this.messageHandlers.delete(handler);
    }

    updateTypingStatus(userId, isTyping) {
        this.client.send('typing', { userId, isTyping });
    }

    markMessageAsRead(messageId) {
        this.client.send('read', { messageId });
    }

    disconnect() {
        this.client.disconnect();
    }
}