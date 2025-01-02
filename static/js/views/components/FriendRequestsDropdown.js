export function FriendRequestsDropdown() {
    return `
        <li class="nav-item me-3">
            <a class="nav-link position-relative" href="#" id="friendRequestsDropdown" role="button" data-bs-toggle="dropdown">
                <i class="bi bi-people-fill fs-5"></i>
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger friend-requests-count">
                    0
                </span>
            </a>
            <div class="dropdown-menu dropdown-menu-end p-2" aria-labelledby="friendRequestsDropdown" style="width: 300px;">
                <h6 class="dropdown-header">Friend Requests</h6>
                <div class="friend-requests-list">
                    <!-- Requests will be dynamically added here -->
                </div>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item text-center small text-primary" href="#/friends">View all friends</a>
            </div>
        </div>
    `;
}