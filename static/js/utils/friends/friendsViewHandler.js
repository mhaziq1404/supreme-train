import { friendService } from '../../services/api/friendService.js';
import { initWhatsAppHandlers } from '../whatsapp/whatsAppHandlers.js';
import { animate } from '../animation.js';

export function initFriendsView() {
    const friendsList = document.getElementById('friendsList');
    const pendingList = document.getElementById('pendingRequestsList');
    const suggestedList = document.getElementById('suggestedFriendsList');
    const searchInput = document.getElementById('searchFriends');

    setTimeout(() => initWhatsAppHandlers(), 0);

    async function loadFriends() {
        try {
            const friends = await friendService.getFriends();
            updateFriendsList(friends);
        } catch (error) {
            showError(friendsList, 'Error loading friends');
        }
    }

    async function loadPendingRequests() {
        try {
            const requests = await friendService.getFriendRequests();
            updatePendingList(requests);
        } catch (error) {
            showError(pendingList, 'Error loading requests');
        }
    }

    async function loadSuggestions() {
        try {
            const suggestions = await friendService.getSuggestedFriends();
            updateSuggestionsList(suggestions);
        } catch (error) {
            showError(suggestedList, 'Error loading suggestions');
        }
    }

    function updateFriendsList(friends) {
        if (!friendsList) return;

        if (friends.length === 0) {
            friendsList.innerHTML = createEmptyState('No friends yet');
            return;
        }

        friendsList.innerHTML = friends.map(friend => `
            <div class="list-group-item p-3">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                        <img src="${friend.avatar || 'https://via.placeholder.com/40'}" 
                             class="rounded-circle me-3" 
                             width="40" 
                             height="40"
                             alt="${friend.name}">
                        <div>
                            <h6 class="mb-0">${friend.name}</h6>
                            <small class="text-muted">${friend.status}</small>
                        </div>
                    </div>
                    <div class="d-flex gap-2">
                        <a data-message-user="${friend.senderId}"
                        data-user-name="${friend.name}" class="btn btn-light btn-sm">
                            <i class="bi bi-chat-dots"></i>
                        </a>
                        <button class="btn btn-light btn-sm" data-remove-friend="${friend.senderId}">
                            <i class="bi bi-person-dash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        animate.staggerChildren(friendsList, '.list-group-item');
    }

    function updatePendingList(requests) {
        if (!pendingList) return;

        if (requests.length === 0) {
            pendingList.innerHTML = createEmptyState('No pending requests');
            return;
        }

        pendingList.innerHTML = requests.map(request => `
            <div class="list-group-item p-3" data-request-id="${request.id}">
                <div class="d-flex gap-3">
                    <img src="${request.avatar || 'https://via.placeholder.com/40'}" 
                         class="rounded-circle" 
                         width="40" 
                         height="40"
                         alt="${request.name}">
                    <div class="flex-grow-1">
                        <h6 class="mb-1">${request.name}</h6>
                        <div class="d-flex gap-2">
                            <button class="btn btn-primary btn-sm accept-request" 
                                    data-user-id="${request.senderId}">Accept</button>
                            <button class="btn btn-outline-secondary btn-sm decline-request"
                                    data-user-id="${request.senderId}">Decline</button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        animate.staggerChildren(pendingList, '.list-group-item');

        const acceptBtns = pendingList.querySelectorAll('.accept-request');
        acceptBtns.forEach((btn) => {
        btn.addEventListener('click', async (e) => {
            const userId = e.target.dataset.userId;
            try {
            await friendService.addFriend(userId);
            // Remove the entire list-group-item
            e.target.closest('.list-group-item')?.remove();
            loadFriends();
            loadPendingRequests();
            } catch (error) {
            console.error('Error accepting friend request:', error);
            }
        });
        });

        const declineBtns = pendingList.querySelectorAll('.decline-request');
        declineBtns.forEach((btn) => {
            btn.addEventListener('click', async (e) => {
                console.log('Declining friend request');
                const userId = e.target.dataset.userId;
                try {
                await friendService.removeFriend(userId);
                loadFriends();
                loadPendingRequests();
                // Remove the entire list-group-item
                e.target.closest('.list-group-item')?.remove();
                } catch (error) {
                console.error('Error declining friend request:', error);
                }
            });
        });
    }

    function updateSuggestionsList(suggestions) {
        if (!suggestedList) return;

        if (suggestions.length === 0) {
            suggestedList.innerHTML = createEmptyState('No suggestions available');
            return;
        }

        suggestedList.innerHTML = suggestions.map(user => `
            <div class="list-group-item p-3">
                <div class="d-flex gap-3">
                    <img src="${user.avatar || 'https://via.placeholder.com/40'}" 
                         class="rounded-circle" 
                         width="40" 
                         height="40"
                         alt="${user.name}">
                    <div class="flex-grow-1">
                        <h6 class="mb-1">${user.name}</h6>
                        <button class="btn btn-primary btn-sm" data-add-friend="${user.id}">
                            <i class="bi bi-person-plus me-1"></i>Add Friend
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        animate.staggerChildren(suggestedList, '.list-group-item');
    }

    function createEmptyState(message) {
        return `
            <div class="text-center text-muted p-4">
                <i class="bi bi-people fs-1 mb-2"></i>
                <p class="mb-0">${message}</p>
            </div>
        `;
    }

    function showError(element, message) {
        if (!element) return;
        element.innerHTML = `
            <div class="alert alert-danger m-3">
                ${message}
            </div>
        `;
    }

    function showSuccessMessage(message) {
        const toast = createToast(message, 'success');
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    function showErrorMessage(message) {
        const toast = createToast(message, 'danger');
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    function createToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast show position-fixed top-0 end-0 m-3 bg-${type} text-white`;
        toast.style.zIndex = '1050';
        toast.innerHTML = `
            <div class="toast-body d-flex align-items-center">
                <i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
                ${message}
            </div>
        `;
        return toast;
    }

    // Event Handlers
    searchInput?.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const items = friendsList?.querySelectorAll('.list-group-item');
        
        items?.forEach(item => {
            const name = item.querySelector('h6').textContent.toLowerCase();
            item.style.display = name.includes(searchTerm) ? 'block' : 'none';
        });
    });

    // Add event listener for remove friend buttons
    document.addEventListener('click', async (e) => {
        const removeBtn = e.target.closest('[data-remove-friend]');
        if (removeBtn) {
            const userId = removeBtn.dataset.removeFriend;
            try {
                await handleRemoveFriend(userId);
                removeBtn.closest('.list-group-item').remove();
                loadFriends();
                showSuccessMessage('Friend removed successfully');
            } catch (error) {
                showErrorMessage('Failed to remove friend');
            }
        }
    });

    async function handleRemoveFriend(userId) {
        await friendService.removeFriend(userId);
    }

    // Load initial data
    loadFriends();
    loadPendingRequests();
    loadSuggestions();
}