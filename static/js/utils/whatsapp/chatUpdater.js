import { createMessageElement, animateNewMessage } from './messageAnimator.js';

export class ChatUpdater {
    constructor(chatContainer) {
        this.chatMessages = chatContainer.querySelector('.chat-messages');
    }

    addMessage(message, isSelf = false) {
        if (!this.chatMessages) return;

        const messageElement = createMessageElement(message, isSelf);
        this.chatMessages.appendChild(messageElement);
        animateNewMessage(messageElement);
    }

    updateMessageStatus(messageId, status) {
        const message = this.chatMessages?.querySelector(`[data-message-id="${messageId}"]`);
        if (message) {
            const statusIcon = message.querySelector('.bi-check2-all');
            if (statusIcon && status === 'read') {
                statusIcon.classList.add('text-primary');
            }
        }
    }
}