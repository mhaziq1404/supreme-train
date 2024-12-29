import { CreateRoomForm } from './components/createRoom/CreateRoomForm.js';
import { initCreateRoomHandlers } from '../utils/gameRoom/createRoomHandlers.js';

export function CreateRoomView() {
    setTimeout(() => initCreateRoomHandlers(), 0);

    return CreateRoomForm();
}