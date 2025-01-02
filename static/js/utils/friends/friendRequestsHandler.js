import { friendService } from '../../services/api/friendService.js';

export function initFriendRequestsHandler() {
    const dropdown = document.getElementById('friendRequestsDropdown');
    const requestsList = document.querySelector('.friend-requests-list');
    const countBadge = document.querySelector('.friend-requests-count');

    async function loadFriendRequests() {
        try {
            const requests = await friendService.getFriendRequests();
            console.log('Friend requests:', requests);
            updateRequestsList(requests);
            updateRequestCount(requests.length);
        } catch (error) {
            console.error('Error loading friend requests:', error);
        }
    }

    function updateRequestsList(requests) {
        if (!requestsList) return;

        if (requests.length === 0) {
            requestsList.innerHTML = `
                <div class="text-center text-muted p-3">
                    No pending requests
                </div>
            `;
            return;
        }

        requestsList.innerHTML = requests.map(request => `
            <div class="dropdown-item p-2 rounded" data-request-id="${request.id}">
                <div class="d-flex gap-2">
                    <div class="flex-shrink-0">
                        <img src="${request.avatar || 'https://via.placeholder.com/32'}" 
                             class="rounded-circle" 
                             width="32" 
                             height="32"
                             alt="${request.name}">
                    </div>
                    <div class="flex-grow-1">
                        <div class="fw-bold">${request.name}</div>
                        <div class="d-flex gap-2 mt-1">
                            <button class="btn btn-primary btn-sm accept-request" 
                                    data-user-id="${request.senderId}">Accept</button>
                            <button class="btn btn-outline-secondary btn-sm decline-request"
                                    data-user-id="${request.senderId}">Decline</button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        // Add event listeners for accept/decline buttons
        requestsList.querySelectorAll('.accept-request').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const userId = e.target.dataset.userId;
                try {
                    await friendService.addFriend(userId);
                    e.target.closest('.dropdown-item').remove();
                    updateRequestCount(requestsList.children.length);
                } catch (error) {
                    console.error('Error accepting friend request:', error);
                }
            });
        });

        requestsList.querySelectorAll('.decline-request').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const userId = e.target.dataset.userId;
                try {
                    await friendService.removeFriend(userId);
                    e.target.closest('.dropdown-item').remove();
                    updateRequestCount(requestsList.children.length);
                } catch (error) {
                    console.error('Error declining friend request:', error);
                }
            });
        });
    }

    function updateRequestCount(count) {
        if (countBadge) {
            countBadge.textContent = count;
            countBadge.style.display = count > 0 ? 'block' : 'none';
        }
    }

    // Load requests initially
    loadFriendRequests();

    // Refresh requests periodically
    setInterval(loadFriendRequests, 30000);
}