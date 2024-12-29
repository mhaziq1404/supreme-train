import { userService } from '../../services/api/userService.js';
import { animate } from '../animation.js';

export function initProfileEdit() {
    const form = document.getElementById('profileEditForm');
    const profilePicture = document.getElementById('profilePicture');
    const profilePreview = document.getElementById('profilePreview');

    // Handle profile picture preview
    profilePicture?.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (file && profilePreview) {
            const reader = new FileReader();
            reader.onload = (e) => {
                profilePreview.src = e.target?.result;
                animate.fadeIn(profilePreview);
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle form submission
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            const formData = new FormData(form);
            const userData = {
                name: formData.get('name'),
                username: formData.get('username'),
                email: formData.get('email'),
                location: formData.get('location'),
                bio: formData.get('bio'),
                preferredMode: formData.get('preferredMode'),
                paddleColor: formData.get('paddleColor'),
                showOnline: formData.get('showOnline') === 'on',
                showStats: formData.get('showStats') === 'on',
                allowMessages: formData.get('allowMessages') === 'on'
            };

            await userService.updateProfile(userData);
            showSuccessMessage();
            setTimeout(() => window.location.href = '#/profile', 1500);

        } catch (error) {
            showErrorMessage(error.message);
        }
    });
}

function showSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
    message.innerHTML = `
        Profile updated successfully!
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(message);
    animate.fadeIn(message);

    setTimeout(() => {
        animate.fadeOut(message);
        setTimeout(() => message.remove(), 300);
    }, 3000);
}

function showErrorMessage(errorText) {
    const message = document.createElement('div');
    message.className = 'alert alert-danger alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
    message.innerHTML = `
        Error updating profile: ${errorText}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(message);
    animate.fadeIn(message);

    setTimeout(() => {
        animate.fadeOut(message);
        setTimeout(() => message.remove(), 300);
    }, 3000);
}