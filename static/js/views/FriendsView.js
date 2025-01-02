import { FriendsList } from './components/friends/FriendsList.js';
import { PendingRequests } from './components/friends/PendingRequests.js';
import { initFriendsView } from '../utils/friends/friendsViewHandler.js';

export function FriendsView() {
    setTimeout(() => initFriendsView(), 0);

    return `
        <div class="row">
            <!-- Header -->
            <div class="col-12 mb-4">
                <div class="card bg-dark text-white">
                    <div class="card-body p-4">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h2 class="mb-1">Friends</h2>
                                <p class="mb-0 text-light">Manage your friends and requests</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Main Content -->
            <div class="col-lg-8">
                ${FriendsList()}
            </div>

            <!-- Sidebar -->
            <div class="col-lg-4">
                ${PendingRequests()}
            </div>
        </div>
    `;
}