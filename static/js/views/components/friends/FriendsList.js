import { LoadingSpinner } from '../../../components/LoadingSpinner.js';

export function FriendsList() {
    return `
        <div class="card mb-4">
            <div class="card-header bg-primary bg-gradient text-white d-flex justify-content-between align-items-center py-3">
                <h5 class="mb-0">Your Friends</h5>
                <div class="input-group w-auto">
                    <input type="text" class="form-control form-control-sm" placeholder="Search friends..." id="searchFriends">
                    <button class="btn btn-light btn-sm" type="button">
                        <i class="bi bi-search"></i>
                    </button>
                </div>
            </div>
            <div class="card-body p-0">
                <div id="friendsList" class="list-group list-group-flush">
                    ${LoadingSpinner()}
                </div>
            </div>
        </div>
    `;
}