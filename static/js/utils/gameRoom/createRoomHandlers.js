import { animate } from '../animation.js';
import { createRoom } from './createRoomService.js';

export function initCreateRoomHandlers() {
  const form = document.getElementById('createRoomForm');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData(form);
      const room = await createRoom(formData);
      
      showSuccessMessage();
      
      // Store room data and redirect
      localStorage.setItem('currentRoom', JSON.stringify(room));
      setTimeout(() => {
        window.location.hash = `/game-room/${room.id}`;
      }, 1000);

    } catch (error) {
      showErrorMessage(error.message);
    }
  });
}

function showSuccessMessage() {
  const message = document.createElement('div');
  message.className = 'alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
  message.innerHTML = `
    Room created successfully! Redirecting...
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  document.body.appendChild(message);
  animate.fadeIn(message);
}

function showErrorMessage(errorText) {
  const message = document.createElement('div');
  message.className = 'alert alert-danger alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
  message.innerHTML = `
    Error creating room: ${errorText}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  document.body.appendChild(message);
  animate.fadeIn(message);
}