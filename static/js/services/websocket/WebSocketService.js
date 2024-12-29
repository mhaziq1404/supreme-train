// WebSocketService.js

class WebSocketService {
    constructor() {
        this.socket = null;
        this.messageHandlers = new Set();
        this.chatroomName = null;
    }

    connect(chatroomName = 'my_room') {
        this.chatroomName = chatroomName;
        const token = localStorage.getItem('token');

        if (token) {
            const wsProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
            const host = window.location.host;
            
            const wsUrl = `${wsProtocol}${host}/api/chat/${this.chatroomName}/?token=${token}`;
            
            this.socket = new WebSocket(wsUrl);

            this.socket.onopen = () => {
                console.log('WebSocket connected');
            };
    
            this.socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.messageHandlers.forEach(handler => handler(data));
            };

            this.socket.onclose = () => {
                setTimeout(() => this.connect(this.chatroomName), 5000);
            };
        } else {
            console.error('No token found in localStorage');
        }
    }

    sendMessage(message) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ message }));
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

export const webSocketService = new WebSocketService();