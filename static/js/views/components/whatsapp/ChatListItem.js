import { formatMessageTime } from '../../../utils/dateUtils.js';

export function ChatListItem({ chat, isBlocked, isActive }) {
    return `
        <div class="chat-item p-3 border-bottom ${isBlocked ? 'blocked' : ''} ${isActive ? 'active' : ''}" 
             data-chat-id="${chat.id}"
             data-user-id="${chat.userId}">
            <div class="d-flex">
                <div class="position-relative">
                    <img src="${chat.avatar}" 
                         class="rounded-circle" 
                         alt="${chat.name}"
                         width="40" 
                         height="40">
                    <span class="position-absolute bottom-0 end-0 bg-${chat.online ? 'success' : 'secondary'} rounded-circle"
                          style="width: 10px; height: 10px;"></span>
                </div>
                <div class="ms-3 flex-grow-1">
                    <div class="d-flex justify-content-between align-items-center">
                        <h6 class="mb-0">
                            ${chat.name}
                            ${isBlocked ? '<i class="bi bi-slash-circle text-muted ms-2"></i>' : ''}
                        </h6>
                        <small class="text-muted">
                            ${formatMessageTime(chat.lastMessage?.timestamp)}
                        </small>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted text-truncate">
                            ${chat.lastMessage?.content || 'No messages yet'}
                        </small>
                        ${chat.unreadCount ? `
                            <span class="badge rounded-pill bg-primary">
                                ${chat.unreadCount}
                            </span>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
}