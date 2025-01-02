export function RoomInfo(room) {
    return `
        <div class="card mb-4">
            <div class="card-header bg-dark text-white">
                <h5 class="mb-0">Room Information</h5>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <small class="text-muted">Room Name</small>
                    <h6 id='txtRoomName'>${room.name}</h6>
                </div>
                <div class="mb-3">
                    <small class="text-muted">Game Mode</small>
                    <h6 id='txtRoomType'>${room.type}</h6>
                </div>
                <div class="mb-3">
                    <small class="text-muted">Players</small>
                    <div id="playersList" class="list-group list-group-flush">
                        ${generatePlayersList(room.players)}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generatePlayersList(players) {
    return players.map(player => `
        <div class="list-group-item d-flex justify-content-between align-items-center">
            <div>
                <i class="bi bi-person-fill me-2"></i>
                ${player.name}
                ${player.host ? '<span class="badge bg-primary ms-2">Host</span>' : ''}
            </div>
            <span style="display:none" class="badge bg-${player.ready ? 'success' : 'secondary'} rounded-pill">
                ${player.ready ? 'Ready' : 'Not Ready'}
            </span>
        </div>
    `).join('');
}