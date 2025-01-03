export function GameInvitation({ gameType, gameId }, isSelf) {
    console.log('Game Invitation:', gameType, isSelf, gameId);
    // For sent invitations
    if (isSelf) {
        return `
            <div class="game-invitation card bg-success bg-opacity-25 border-0 mb-2" style="max-width: 280px;">
                <div class="card-body p-3">
                    <div class="d-flex align-items-center mb-2">
                        <i class="bi bi-controller fs-4 text-white me-2"></i>
                        <h6 class="mb-0 text-white">Game Invitation Sent</h6>
                    </div>
                    <p class="mb-0 small text-white">${gameType.charAt(0).toUpperCase() + gameType.slice(1)} Match</p>
                </div>
            </div>
        `;
    }

    // For received invitations
    return `
        <div class="game-invitation card bg-light border-0 mb-2" style="max-width: 280px;">
            <div class="card-body p-3">
                <div class="d-flex align-items-center mb-2">
                    <i class="bi bi-controller fs-4 text-primary me-2"></i>
                    <h6 class="mb-0">Game Invitation</h6>
                </div>
                <p class="mb-2 small">${gameType.charAt(0).toUpperCase() + gameType.slice(1)} Match</p>
                <a href="#/room/?roomid=${gameId}" class="btn btn-primary btn-sm w-100">
                    <i class="bi bi-door-open me-1"></i>Join Room
                </a>
            </div>
        </div>
    `;
}