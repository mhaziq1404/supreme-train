import { roomService } from '../../services/api/roomService.js';
import { initChat } from './chatHandlers.js';
import { initGameControls } from './gameControls.js';
import { initPongGame } from '../../game/PongGame.js';

export function initGameRoom(room) {
    initGameControls(room);
    initChat();
    initPongGame();

    // Set up real-time updates
    const updateInterval = setInterval(async () => {
        try {
            const updatedRoom = await roomService.getRoomDetails(room.id);
            updateRoomInfo(updatedRoom);
        } catch (error) {
            console.error('Error updating room:', error);
        }
    }, 3000);

    // Cleanup on page leave
    window.addEventListener('hashchange', () => {
        clearInterval(updateInterval);
    });
}

function updateRoomInfo(room) {
    const playersList = document.getElementById('playersList');
    if (playersList) {
        playersList.innerHTML = generatePlayersList(room.players);
    }
}

function generatePlayersList(players) {
    return players.map(player => `
        <div class="list-group-item d-flex justify-content-between align-items-center">
            <div>
                <i class="bi bi-person-fill me-2"></i>
                ${player.name}
                ${player.host ? '<span class="badge bg-primary ms-2">Host</span>' : ''}
            </div>
            <span class="badge bg-${player.ready ? 'success' : 'secondary'} rounded-pill">
                ${player.ready ? 'Ready' : 'Not Ready'}
            </span>
        </div>
    `).join('');
}