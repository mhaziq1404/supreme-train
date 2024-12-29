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

    document.addEventListener('click', (e) => {
        const messageBtn = e.target.closest('[data-message-user]');
        if (messageBtn) {
            const userId = messageBtn.dataset.messageUser;
            const userName = messageBtn.dataset.userName;
            startNewChat(userId, userName);
        }
    });
    
    function startNewChat(userId, userName) {
    
        if (whatsAppState.getChat(userId)) {
            whatsAppState.selectChat(userId);
        } else {
            whatsAppState.addNewChat(userId, userName);
        }
    
        // Navigate to the WhatsApp view (or wherever your chat UI is located)
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
                    isActive: chat.id === whatsAppState.selectedChat
                })
            )
            .join('');

        // Add click handlers
        chatList.querySelectorAll('.chat-item').forEach((item) => {
            item.addEventListener('click', () => {
                const chatId = item.dataset.userId;
                whatsAppState.selectChat(chatId);
                //console.log('Selected chat:', whatsAppState.getSelectedChat());
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

        // Render messages
        chatMessages.innerHTML = selectedChat.messages
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

    function handleSendMessage() {
        if (!messageInput) return;
        
        const content = messageInput.value.trim();
        
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
            const name = item.querySelector('h6').textContent.toLowerCase();
            const message = item.querySelector('small').textContent.toLowerCase();
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
        updateChatList();
        updateChatMessages();
        updateChatHeader();
    });

    // Initial render
    updateChatList();
    updateChatMessages();
    updateChatHeader();
}
