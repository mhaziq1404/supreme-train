import { animate } from '../animation.js';
import { roomService } from '../../services/api/roomService.js';

export function initRoomHandlers() {
    const createRoomBtn = document.getElementById('createRoomBtn');
    const quickPlayBtn = document.getElementById('quickPlayBtn');
    const refreshRoomsBtn = document.getElementById('refreshRooms');
    const roomsList = document.getElementById('roomsList');

    async function handleJoinRoom(roomId) {
        try {
            await roomService.joinRoom(roomId);
            window.location.href = '#/game-room';
        } catch (error) {
            console.error('Error joining room:', error);
        }
    }

    async function refreshRooms() {
        try {
            const rooms = await roomService.getRooms();
            if (roomsList) {
                roomsList.innerHTML = generateRoomsList(rooms);
                animate.staggerChildren(roomsList, '.list-group-item');
            }
        } catch (error) {
            console.error('Error refreshing rooms:', error);
        }
    }

    // Event Listeners
    createRoomBtn?.addEventListener('click', () => {
        animate.fadeIn(createRoomBtn, 100);
        window.location.href = '#/create-room';
    });

    quickPlayBtn?.addEventListener('click', () => {
        animate.fadeIn(quickPlayBtn, 100);
        window.location.href = '#/game-room';
    });

    refreshRoomsBtn?.addEventListener('click', () => {
        const icon = refreshRoomsBtn.querySelector('.bi-arrow-clockwise');
        if (icon) {
            icon.style.transition = 'transform 0.5s ease';
            icon.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                icon.style.transform = 'rotate(0deg)';
            }, 500);
        }
        refreshRooms();
    });

    // Add click handlers for room items
    document.querySelectorAll('#roomsList .list-group-item')?.forEach(item => {
        item.addEventListener('click', () => {
            const roomId = item.dataset.roomId;
            if (roomId) {
                handleJoinRoom(roomId);
            }
        });
    });

    // Initial animations
    if (roomsList) {
        animate.staggerChildren(roomsList, '.list-group-item');
    }
}

function generateRoomsList(rooms) {
    if (!rooms.length) {
        return `
            <div class="list-group-item text-center text-muted py-5">
                No active rooms found
            </div>
        `;
    }

    return rooms.map(room => `
        <div class="list-group-item list-group-item-action p-3" data-room-id="${room.id}">
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                    <div class="room-icon me-3 p-2 bg-${getBadgeColor(room.type)} bg-opacity-10 rounded-circle">
                        <i class="bi bi-controller fs-4 text-${getBadgeColor(room.type)}"></i>
                    </div>
                    <div>
                        <h6 class="mb-1">${room.name}</h6>
                        <small class="text-muted">Hosted by ${room.host}</small>
                    </div>
                </div>
                <div class="d-flex align-items-center gap-3">
                    <div class="text-end">
                        <span class="badge bg-${getBadgeColor(room.type)}">${room.type}</span>
                        <small class="d-block text-muted mt-1">${room.skill || 'All Levels'}</small>
                    </div>
                    <div class="text-end">
                        <div class="mb-1">${room.players.length}/${room.maxPlayers}</div>
                        <small class="text-muted">${room.status}</small>
                    </div>
                    <button class="btn btn-primary btn-sm join-room-btn">
                        ${room.status === "Waiting" ? "Join" : "Spectate"}
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function getBadgeColor(type) {
    const colors = {
        'Ranked': 'danger',
        'Casual': 'success',
        'Tournament': 'warning'
    };
    return colors[type] || 'primary';
}