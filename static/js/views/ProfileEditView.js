import { ProfileEditForm } from './components/profile/ProfileEditForm.js';
import { LoadingSpinner } from '../components/LoadingSpinner.js';
import { initProfileEdit } from '../utils/profile/profileEditHandlers.js';

export async function ProfileEditView() {
    const container = document.createElement('div');
    container.innerHTML = LoadingSpinner();

    try {
        container.innerHTML = await ProfileEditForm();
        setTimeout(() => initProfileEdit(), 0);
    } catch (error) {
        container.innerHTML = `
            <div class="alert alert-danger">
                Error loading profile: ${error.message}
            </div>
        `;
    }

    return container.innerHTML;
}