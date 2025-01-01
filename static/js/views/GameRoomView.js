import { GameArea } from './components/gameRoom/GameArea.js';
import { RoomInfo } from './components/gameRoom/RoomInfo.js';
import { LoadingSpinner } from '../components/LoadingSpinner.js';
import { initGameRoom } from '../utils/gameRoom/gameRoomHandlers.js';
import { PlayersList } from './components/lobby/PlayersList.js';
import { authService } from '../services/api/authService.js';

export async function GameRoomView(host = 0) {
    const container = document.createElement('div');
    container.innerHTML = LoadingSpinner();

    try {
        // Get room ID from params or localStorage
        // const roomId = roomid || JSON.parse(localStorage.getItem('currentRoom'))?.id;
        // if (!roomId) {
        //     throw new Error('Room ID not found');
        // }

        // const room = await roomService.getRoomDetails(roomId);
        // if (!room) {
        //     throw new Error('Room not found');
        // }

        let room = JSON.parse(localStorage.getItem('currentRoom'));
        let join = 'host';

        const user = await authService.getCurrentUser();
        if (user.username != host) {
            join = 'player';
            room = {
                'id': 0,
                'name': 'Retrieving',
                'type': 'Retrieving',
                'players': [
                    {
                        'name': user.username,
                        'host': false,
                        'ready': false
                    }
                ]
            };
        }

        console.log(room);
            
        const players = await PlayersList();
        
        container.innerHTML = `
            <div class="row g-4">
                <div class="col-lg-8">
                    ${GameArea(room)}
                </div>
                <div class="col-lg-4">
                    ${RoomInfo(room)}
                    <div class="players-section" style="min-height: 300px;">
                        ${players}
                    </div>
                </div>
            </div>
        `;

        setTimeout(() => initGameRoom(room, join), 0);

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
