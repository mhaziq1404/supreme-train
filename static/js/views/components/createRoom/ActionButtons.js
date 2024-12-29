

export function ActionButtons() {
    return `
        <div class="d-flex justify-content-between">
            <a href="#/lobby" class="btn btn-outline-secondary">
                <i class="bi bi-arrow-left me-2"></i>Back to Lobby
            </a>
            <button type="submit" class="btn btn-primary">
                <i class="bi bi-play-fill me-2"></i>Create Room
            </button>
        </div>
    `;
}