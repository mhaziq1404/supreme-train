import { roomService } from '../../services/api/roomService.js';
import { initChat } from './chatHandlers.js';
import { initGameControls } from './gameControls.js';

export function initGameRoom(room, join) {
    initGameControls(room, join);
    //initPongGame();
}