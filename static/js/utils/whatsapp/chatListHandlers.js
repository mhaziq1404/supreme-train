import { animate } from '../animation.js';

export function initChatListHandlers({ onChatSelect, onSearch }) {
    const searchInput = document.getElementById('searchMessages');
    const searchButton = document.getElementById('searchButton');
    const chatList = document.querySelector('.chat-list');

    function handleSearch() {
        const searchTerm = searchInput?.value.toLowerCase().trim();
        if (onSearch) {
            onSearch(searchTerm);
        } else {
            // Fallback local search if no handler provided
            const chatItems = chatList?.querySelectorAll('.chat-item');
            chatItems?.forEach(item => {
                const name = item.querySelector('h6').textContent.toLowerCase();
                const lastMessage = item.querySelector('.text-muted.text-truncate')
                    .textContent.toLowerCase();
                const isVisible = !searchTerm || 
                    name.includes(searchTerm) || 
                    lastMessage.includes(searchTerm);
                
                item.style.display = isVisible ? 'block' : 'none';
                if (isVisible) {
                    animate.fadeIn(item);
                }
            });
        }
    }

    function handleChatSelect(e) {
        const chatItem = e.target.closest('.chat-item');
        if (!chatItem) return;

        // Remove active class from all items
        chatList?.querySelectorAll('.chat-item').forEach(item => {
            item.classList.remove('active');
        });

        // Add active class to selected item
        chatItem.classList.add('active');

        // Call the selection handler
        if (onChatSelect) {
            onChatSelect({
                chatId: chatItem.dataset.chatId,
                userId: chatItem.dataset.userId
            });
        }
    }

    // Event Listeners
    searchInput?.addEventListener('input', handleSearch);
    searchButton?.addEventListener('click', handleSearch);
    chatList?.addEventListener('click', handleChatSelect);

    // Return cleanup function
    return () => {
        searchInput?.removeEventListener('input', handleSearch);
        searchButton?.removeEventListener('click', handleSearch);
        chatList?.removeEventListener('click', handleChatSelect);
    };
}