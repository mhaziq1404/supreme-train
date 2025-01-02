export function BasicSettings() {
    return `
        <div class="mb-4">
            <label class="form-label">Room Name</label>
            <input type="text" 
                   class="form-control" 
                   name="name" 
                   required
                   placeholder="Enter a name for your room">
        </div>

        <div class="mb-4">
            <label class="form-label">Game Mode</label>
            <select class="form-select" name="type">
                <option value="casual">Casual</option>
            </select>
        </div>

        <div class="mb-4">
            <label class="form-label">Max Players</label>
            <select class="form-select" name="maxPlayers">
                <option value="2">2 Players</option>
            </select>
        </div>
    `;
}