export function BasicSettings() {
    return `
        <div class="mb-4">
            <label class="form-label">Room Name</label>
            <input type="text" 
                   class="form-control" 
                   name="roomName" 
                   required
                   placeholder="Enter a name for your room">
        </div>

        <div class="mb-4">
            <label class="form-label">Game Mode</label>
            <select class="form-select" name="gameMode">
                <option value="casual">Casual</option>
                <option value="ranked">Ranked</option>
                <option value="tournament">Tournament</option>
            </select>
        </div>

        <div class="mb-4">
            <label class="form-label">Max Players</label>
            <select class="form-select" name="maxPlayers">
                <option value="2">2 Players</option>
                <option value="4">4 Players (Tournament)</option>
            </select>
        </div>
    `;
}