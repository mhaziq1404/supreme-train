import { roomService } from '../../services/api/roomService.js';

export async function createRoom(formData) {
  // Transform form data into the expected API format
  const roomData = {
    name: formData.get('room'),
    type: formData.get('type'),
    maxPlayers: parseInt(formData.get('maxPlayers'), 10),
    settings: {
      powerUps: formData.get('powerUps') === 'on',
      spectators: formData.get('spectators') === 'on',
    },
  };

  // Make API request to create room
  try {
    const createdRoom = await roomService.createRoom(roomData);
    return createdRoom;
  } catch (error) {
    console.error('Error creating room:', error);
    throw error;
  }
}
