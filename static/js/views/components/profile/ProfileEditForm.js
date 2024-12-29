import { userService } from '../../../services/api/userService.js';

export async function ProfileEditForm() {
    const userData = await userService.getProfile();
    
    return `
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <div class="card border-0 shadow-sm">
                    <div class="card-header bg-dark text-white py-3">
                        <div class="d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">Edit Profile</h5>
                            <a href="/profile" class="btn btn-outline-light btn-sm">
                                <i class="bi bi-x-lg"></i> Cancel
                            </a>
                        </div>
                    </div>
                    <div class="card-body p-4">
                        <form id="profileEditForm">
                            <div class="text-center mb-4">
                                <div class="position-relative d-inline-block">
                                    <img src="${userData.avatar || 'https://via.placeholder.com/150'}" 
                                         class="rounded-circle" 
                                         alt="Profile Picture" 
                                         id="profilePreview">
                                    <label for="profilePicture" class="btn btn-primary btn-sm position-absolute bottom-0 end-0 rounded-circle">
                                        <i class="bi bi-camera-fill"></i>
                                    </label>
                                    <input type="file" id="profilePicture" class="d-none" accept="image/*">
                                </div>
                            </div>

                            <div class="row g-3 mb-4">
                                <div class="col-md-6">
                                    <label class="form-label">Username</label>
                                    <div class="input-group">
                                        <span class="input-group-text">@</span>
                                        <input type="text" class="form-control" name="username" value="${userData.username}" required readonly>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Email</label>
                                    <input type="email" class="form-control" name="email" value="${userData.email}" required readonly>
                                </div>
                            </div>

                            <div class="mb-4">
                                <label class="form-label">Bio</label>
                                <textarea class="form-control" name="bio" rows="3">${userData.bio || ''}</textarea>
                            </div>

                            <div class="d-flex justify-content-end gap-2">
                                <button type="button" class="btn btn-outline-secondary" onclick="history.back()">
                                    Discard Changes
                                </button>
                                <button type="submit" class="btn btn-primary">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
}