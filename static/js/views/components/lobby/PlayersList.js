

import { userService } from '../../../services/api/userService.js';
import { LoadingSpinner } from '../../../components/LoadingSpinner.js';
import { initWhatsAppHandlers } from '../../../utils/whatsapp/whatsAppHandlers.js';
import { initFriendHandlers } from '../../../utils/friends/friendHandlers.js';

export async function PlayersList() {
    const container = document.createElement('div');
    container.innerHTML = LoadingSpinner();

    try {
        const players = await userService.getOnlinePlayers();
        container.innerHTML = `
            <div class="card">
                <div class="card-header bg-success bg-gradient text-white">
                    <h5 class="mb-0">Online Players</h5>
                </div>
                <div class="card-body p-0">
                    <div class="list-group list-group-flush" style="max-height: 300px; overflow-y: auto;">
                        ${generatePlayersList(players)}
                    </div>
                </div>
            </div>
        `;

        // Initialize message handlers
        setTimeout(() => initWhatsAppHandlers(), 0);
        setTimeout(() => initFriendHandlers(), 0);
    } catch (error) {
        container.innerHTML = `
            <div class="alert alert-danger">
                Error loading players: ${error.message}
            </div>
        `;
    }

    return container.innerHTML;
}

function generatePlayersList(players) {
    if (!players.length) {
        return `
            <div class="list-group-item text-center text-muted py-4">
                No players online
            </div>
        `;
    }

    return players
        .map(
            (player) => `
        <div class="list-group-item">
            <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
                <div class="position-relative">
                <img 
                    src="${player.avatar || 'https://via.placeholder.com/32'}"
                    class="rounded-circle"
                    alt="${player.name}"
                    width="32"
                    height="32"
                />
                <span
                    class="position-absolute bottom-0 end-0 bg-${player.status === 'Online' ? 'success' : 'warning'
                } rounded-circle"
                    style="width: 8px; height: 8px;"
                ></span>
                </div>
                <div class="ms-2">
                <div class="mb-0 fw-semibold">${player.name}</div>
                <small class="text-muted">${player.rank} • ${player.elo} ELO</small>
                </div>
            </div>
            <div class="dropdown">
                <button data-add-friend="${player.id}" class="btn btn-light btn-sm">
                <i class="bi bi-person-plus"></i>
                </button>
                    <button class="btn btn-light btn-sm"
                    data-message-user="${player.id}"
                    data-user-name="${player.name}">
                    <i class="bi bi-chat-dots"></i>
                </button>
                ${window.location.hash.includes('#/room')
                    ? `<button class="btn btn-light btn-sm"
                    data-message-user-room="${player.id}"
                    data-user-name-room="${player.name}">
                    <i class="bi bi-controller"></i>
                    </button>`
                    : ''
                }
            </div>
            </div>
        </div>
        `
        )
        .join('');
}
