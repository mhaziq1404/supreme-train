import { webSocketService } from '../websocket/WebSocketService.js';

export class ChatMessageHandler {
    constructor(chatState) {
        this.chatState = chatState;
        this.setupWebSocket();
    }

    setupWebSocket() {
        webSocketService.onMessage((rawMessage) => {
            //console.log('Received message:', rawMessage);
          
            // If the message isn't an object or is null, it's likely invalid.
            if (typeof rawMessage !== 'object' || rawMessage === null) {
              console.error('Invalid message format:', rawMessage);
              return;
            }
          
            // Destructure the 'type' and 'data' properties
            const { type, data } = rawMessage.message.data;
          
            // Check if 'type' is missing or empty
            if (!type) {
              console.warn('Message has no "type" field:', rawMessage);
              return;
            }

            console.log('Received message:', rawMessage.message.senderId, this.chatState.userId);

            if (rawMessage.message.senderId == this.chatState.userId) {
                return;
            }
          
            switch (type) {
              case 'new_message':
                // 'data' should contain information about the new message
                this.handleNewMessage(data, rawMessage.message.senderId, rawMessage.message.senderName);
                break;
          
              case 'message_status':
                // 'data' should contain status info (e.g., delivered/read)
                this.handleMessageStatus(data);
                break;
          
              default:
                console.warn(`Unrecognized message type: "${type}"`, rawMessage);
                break;
            }
          });
          
    }

    handleNewMessage(message, senderId, senderName) {
      if (!message.recipientId || !message.content || !message.timestamp) {
        console.error('Invalid message data:', message);
        return;
      }
    
      const content = message.content.trim() || '';
    
      const newMessage = {
        id: Date.now().toString(),
        content,
        timestamp: message.timestamp,
        senderId: senderId,
        status: 'sent',
      };
    
      let chat = this.chatState.chats.get(senderId.toString()) || this.chatState.chats.get(senderId) ;

      console.log('Chat:', this.chatState.chats);
      if (!chat) {
        console.warn(`Chat not found for senderId: ${senderId}, creating a new one.`);
    
        // Create a new chat if one doesn't exist
        this.chatState.chats.set(senderId, {
          id: senderId.toString(),
          user: {
            id: senderId.toString(),
            name: senderName,
            avatar: 'https://via.placeholder.com/40',
            status: 'Online',
          },
          messages: [],
        });
    
        chat = this.chatState.chats.get(senderId);
      }
    
      chat.messages.push(newMessage);
    
    }
      

    handleMessageStatus(data) {
        this.chatState.updateMessageStatus(data.messageId, data.status);
    }

    sendMessage(recipientId, content) {
        const message = {
            type: 'new_message',
            data: {
                recipientId,
                content,
                timestamp: new Date().toISOString()
            }
        };
        webSocketService.sendMessage(message);
    }
}

export const createChatMessageHandler = (chatState) => {
    return new ChatMessageHandler(chatState);
};