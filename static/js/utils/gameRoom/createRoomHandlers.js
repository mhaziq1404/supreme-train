import { animate } from '../animation.js';
import { createRoom } from './createRoomService.js';
import { authService } from '../../services/api/authService.js';

function formDataToObject(formData) {
  const obj = {};
  formData.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
}

export function initCreateRoomHandlers() {
  const form = document.getElementById('createRoomForm');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData(form);
      const room = await createRoom(formData);
      const host = await authService.getCurrentUser();
      const formDataDetail = formDataToObject(formData);
      const players = { 'players': [
                {
                    'name': host.username,
                    'host': true,
                    'ready': false
                }
            ]};
      
      const combinedRoom = { 'roomid': host.username, ...formDataDetail, ...players };
      
      showSuccessMessage();
      
      // Store room data and redirect
      localStorage.setItem('currentRoom', JSON.stringify(combinedRoom));
      setTimeout(() => {
        window.location.hash = `/room/?roomid=${host.username}`;
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