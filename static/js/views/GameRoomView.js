import { GameArea } from './components/gameRoom/GameArea.js';
import { RoomInfo } from './components/gameRoom/RoomInfo.js';
import { RoomChat } from './components/gameRoom/RoomChat.js';
import { LoadingSpinner } from '../components/LoadingSpinner.js';
import { initGameRoom } from '../utils/gameRoom/gameRoomHandlers.js';
import { roomService } from '../services/api/roomService.js';

export async function GameRoomView(params) {
    const container = document.createElement('div');
    container.innerHTML = LoadingSpinner();

    try {
        // Get room ID from params or localStorage
        const roomId = params?.id || JSON.parse(localStorage.getItem('currentRoom'))?.id;
        if (!roomId) {
            throw new Error('Room ID not found');
        }

        const room = await roomService.getRoomDetails(roomId);
        if (!room) {
            throw new Error('Room not found');
        }
        
        container.innerHTML = `
            <div class="row g-4">
                <div class="col-lg-8">
                    ${GameArea(room)}
                </div>
                <div class="col-lg-4">
                    ${RoomInfo(room)}
                    ${RoomChat()}
                </div>
            </div>
        `;

        setTimeout(() => initGameRoom(room), 0);

    } catch (error) {
        container.innerHTML = `
            <div class="alert alert-danger">
                Error loading game room: ${error.message}
                <div class="mt-3">
                    <a href="#/lobby" class="btn btn-primary">Return to Lobby</a>
                </div>
            </div>
        `;
    }

    return container.innerHTML;
}