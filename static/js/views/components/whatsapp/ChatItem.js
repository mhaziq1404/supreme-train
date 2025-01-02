import { formatMessageTime } from '../../../utils/dateUtils.js';

export function ChatItem({ user, lastMessage, unreadCount = 0, isActive = false, isBlocked = false }) {
    if (!user || !lastMessage) {
        return '';
    }
    return `
        <div class="chat-item p-3 border-bottom ${isActive ? 'active bg-light' : ''} ${isBlocked ? 'opacity-75' : ''}" 
             role="button" 
             data-user-id="${user.id}">
            <div class="d-flex">
                <div class="position-relative">
                    <img src="${user.avatar}" 
                         class="rounded-circle" 
                         alt="${user.name}"
                         width="40" 
                         height="40">
                    <span class="position-absolute bottom-0 end-0 bg-${user.status === 'Online' ? 'success' : 'secondary'} rounded-circle"
                          style="width: 10px; height: 10px;"></span>
                </div>
                <div class="ms-3 flex-grow-1">
                    <div class="d-flex justify-content-between align-items-center">
                        <h6 class="mb-0">
                            ${user.name}
                            ${isBlocked ? '<i class="bi bi-slash-circle text-muted ms-1"></i>' : ''}
                        </h6>
                        <small class="text-muted">${formatMessageTime(lastMessage.timestamp)}</small>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted text-truncate" style="max-width: 70%;">
                            ${lastMessage.content}
                        </small>
                        ${unreadCount > 0 ? `
                            <span class="badge rounded-pill bg-primary">${unreadCount}</span>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
}