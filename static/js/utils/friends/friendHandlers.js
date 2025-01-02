import { friendService } from '../../services/api/friendService.js';

export function initFriendHandlers() {
    document.addEventListener('click', async (e) => {
        const addFriendBtn = e.target.closest('[data-add-friend]');
        if (addFriendBtn) {
            const userId = addFriendBtn.dataset.addFriend;
            try {
                await handleAddFriend(userId);
                updateFriendButton(addFriendBtn);
                showSuccessMessage('Friend request sent!');
            } catch (error) {
                showErrorMessage('Failed to send friend request');
            }
        }
    });
}

async function handleAddFriend(userId) {
    await friendService.addFriend(userId);
}

function updateFriendButton(button) {
    button.innerHTML = '<i class="bi bi-person-check-fill me-2"></i>Request Sent';
    button.disabled = true;
    button.classList.replace('btn-primary', 'btn-success');
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