import { lobbyChatService } from '../../services/websocket/lobbyChatService.js';
import { animate } from '../animation.js';

export function initLobbyChatHandlers() {
  const chatMessages = document.querySelector('.chat-messages');
  const chatInput = document.getElementById('lobbyChatInput');
  const sendButton = document.getElementById('lobbyChatSend');

  function addMessage(message) {
    if (!chatMessages) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = 'message mb-2';
    messageDiv.innerHTML = `
      <small class="fw-bold">${message.sender}:</small>
      <span>${message.content}</span>
    `;

    chatMessages.appendChild(messageDiv);
    animate.fadeIn(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function handleSendMessage() {
    const content = chatInput?.value?.trim();
    if (!content) return;

    const message = {
        type: 'new_message',
        data: {
            "content": content,
            timestamp: new Date().toISOString()
        }
    };

    lobbyChatService.sendMessage(message);
    chatInput.value = '';
  }

  // Event listeners
  sendButton?.addEventListener('click', handleSendMessage);
  
  chatInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  });

  // WebSocket message handler
  lobbyChatService.onMessage((data) => {
    console.log('Received message:', data);
    console.log('data.type:', data.type);
    if (data.type === 'chat_message') {
      console.log(data.sender);
      console.log(data.content);
      addMessage({
        sender: data.sender,
        content: data.content
      });
    }
  });

  // Connect to WebSocket
  lobbyChatService.connect();

  // Cleanup function
  return () => {
    sendButton?.removeEventListener('click', handleSendMessage);
    chatInput?.removeEventListener('keypress', handleSendMessage);
    lobbyChatService.disconnect();
  };
}
