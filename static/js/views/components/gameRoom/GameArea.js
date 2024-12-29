export function GameArea(room) {
    return `
        <div class="card bg-dark">
            <div class="card-body p-0">
                <div class="d-flex justify-content-between align-items-center bg-primary bg-gradient text-white p-3">
                    <div class="d-flex align-items-center">
                        <h4 class="mb-0 me-3">${room.name}</h4>
                        <div class="score-display">
                            <span id="player1Score">0</span>
                            <span class="mx-2">-</span>
                            <span id="player2Score">0</span>
                        </div>
                    </div>
                    <div class="d-flex gap-2">
                        <button class="btn btn-light btn-sm" id="readyBtn">
                            <i class="bi bi-check-circle-fill"></i> Ready
                        </button>
                        <button class="btn btn-outline-light btn-sm" id="leaveRoom">
                            <i class="bi bi-box-arrow-right"></i> Leave
                        </button>
                    </div>
                </div>
                <div id="gameContainer" style="height: 75vh; position: relative;">
                    <canvas id="pongCanvas"></canvas>
                    <div id="gameOverlay" class="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style="display: none !important;">
                        <div class="text-center text-white">
                            <h2 id="overlayMessage"></h2>
                            <button class="btn btn-primary mt-3" id="restartBtn">
                                <i class="bi bi-play-fill"></i> Play Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}