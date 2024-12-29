import { animate } from '../animation.js';

export function animateNewMessage(messageElement) {
    animate.fadeIn(messageElement, 300);
    
    // Scroll to the new message
    const chatMessages = messageElement.closest('.chat-messages');
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

export function createMessageElement(message, isSelf = false) {
    const div = document.createElement('div');
    div.className = `message ${isSelf ? 'message-self' : 'message-other'} mb-3`;
    div.innerHTML = `
        <div class="message-content p-3">
            ${message.content}
            <div class="message-info d-flex align-items-center mt-1">
                <small class="me-2">${formatMessageTime(message.timestamp)}</small>
                ${isSelf ? `<i class="bi bi-check2-all ${message.status === 'read' ? 'text-primary' : ''}"></i>` : ''}
            </div>
        </div>
    `;
    return div;
}

function formatMessageTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}