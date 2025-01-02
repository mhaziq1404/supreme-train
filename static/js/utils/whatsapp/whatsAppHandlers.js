import { WhatsAppState } from '../../services/WhatsAppState.js';
import { Message } from '../../views/components/whatsapp/Message.js';
import { ChatItem } from '../../views/components/whatsapp/ChatItem.js';
import { blockingService } from '../../services/chat/BlockingService.js';

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

    // Handle block/unblock user
    document.addEventListener('click', (e) => {
        // Handle block toggling
        const blockBtn = e.target.closest('#toggleBlockBtn');
        if (blockBtn && !blockBtn.disabled) {
          e.preventDefault();
          e.stopPropagation();
          // Disable the button so it doesn't run again
          blockBtn.disabled = true;
      
          const selectedChat = whatsAppState.getSelectedChat();
          if (selectedChat) {
            //console.log('Toggle block for:', selectedChat.id);
            const isNowBlocked = blockingService.toggleBlock(selectedChat.id);
            updateChatHeader();
            //console.log('User is now blocked:', isNowBlocked);
            showBlockingToast(selectedChat.user.name, isNowBlocked);
            setTimeout(() => {
                blockBtn.disabled = false;
            }, 2000);
          }
        }
      
        // Handle new chat messages
        const messageBtn = e.target.closest('[data-message-user]');
        if (messageBtn) {
          e.preventDefault();
          e.stopPropagation();
          messageBtn.disabled = true;
      
          const userId = messageBtn.dataset.messageUser;
          const userName = messageBtn.dataset.userName;
          console.log('Start chat with:', userId, userName);
          startNewChat(userId, userName);
          setTimeout(() => {
            messageBtn.disabled = false;
          }, 2000);
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
                                    <a class="dropdown-item" id="viewProfile" href="#/userprofile?userid=${selectedChat.user.id}">
                                        <i class="bi bi-person-circle me-2"></i>View Profile
                                    </a>
                                </li>
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
        chatList.innerHTML = chats
            .map(chat => ChatItem({
                user: chat.user,
                lastMessage: chat.messages[chat.messages.length - 1],
                unreadCount: 0,
                isActive: chat.id === whatsAppState.selectedChat,
                isBlocked: blockingService.isBlocked(chat.id)
            }))
            .join('');

        chatList.querySelectorAll('.chat-item').forEach(item => {
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

        const isBlocked = blockingService.isBlocked(selectedChat.id);
        let content = '';

        if (isBlocked) {
            content += `
                <div class="alert alert-warning text-center m-3">
                    <i class="bi bi-slash-circle me-2"></i>
                    You have blocked this user. Unblock to send messages.
                </div>
            `;
        }

        content += selectedChat.messages
            .map(msg => Message({
                content: msg.content,
                timestamp: msg.timestamp,
                isSelf: msg.senderId === 'self',
                status: msg.status
            }))
            .join('');

        chatMessages.innerHTML = content;
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    setInterval(updateChatMessages , 3000);

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

        const isBlocked = blockingService.isBlocked(selectedChat.id);
        const blockBtnLabel = isBlocked ? 'Unblock User' : 'Block User';
        const blockBtnIcon = isBlocked ? 'bi-slash-circle-fill' : 'bi-slash-circle';

        chatHeader.innerHTML = `
            <div class="d-flex align-items-center p-3">
                <img src="${selectedChat.user.avatar}" 
                     class="rounded-circle me-2" 
                     alt="${selectedChat.user.name}"
                     width="40" height="40">
                <div>
                    <h6 class="mb-0">
                        ${selectedChat.user.name}
                        ${isBlocked ? '<i class="bi bi-slash-circle text-muted ms-2"></i>' : ''}
                    </h6>
                    <small class="text-muted">${selectedChat.user.status}</small>
                </div>
                <div class="dropdown ms-auto">
                    <button class="btn btn-light rounded-circle" type="button" data-bs-toggle="dropdown">
                        <i class="bi bi-three-dots-vertical"></i>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li>
                            <a class="dropdown-item" id="viewProfile" href="#/userprofile?userid=${selectedChat.user.id}">
                                <i class="bi bi-person-circle me-2"></i>View Profile
                            </a>
                        </li>
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

        if (!selectedChat || blockingService.isBlocked(selectedChat.id)) {
            return;
        }

        if (content) {
            whatsAppState.sendMessage(content);
            messageInput.value = '';
        }
    }

    function showBlockingToast(userName, isBlocked) {
        const toast = document.createElement('div');
        toast.className = 'toast position-fixed top-0 end-0 m-3';
        toast.style.zIndex = '1050';
        
        toast.innerHTML = `
            <div class="toast-body d-flex align-items-center ${isBlocked ? 'bg-warning' : 'bg-success'} text-white">
                <i class="bi ${isBlocked ? 'bi-slash-circle' : 'bi-check-circle'} me-2"></i>
                ${userName} has been ${isBlocked ? 'blocked' : 'unblocked'}
            </div>
        `;

        document.body.appendChild(toast);
        new bootstrap.Toast(toast, { delay: 3000 }).show();
    }

    // Event listeners
    sendButton?.addEventListener('click', handleSendMessage);
    messageInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });

    searchInput?.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const items = chatList?.querySelectorAll('.chat-item');
        
        items?.forEach(item => {
            const name = item.querySelector('h6')?.textContent.toLowerCase() || '';
            const message = item.querySelector('small')?.textContent.toLowerCase() || '';
            const isVisible = name.includes(searchTerm) || message.includes(searchTerm);
            item.style.display = isVisible ? 'block' : 'none';
        });
    });

    // Subscribe to state changes
    whatsAppState.subscribe(() => {
        updateChatList();
        updateChatMessages();
        updateChatHeader();
    });

    // Initial render
    updateChatList();
    updateChatMessages();
    updateChatHeader();
}