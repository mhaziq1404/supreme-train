export function GameSettings() {
    return `
        <div class="mb-4">
            <label class="form-label">Game Settings</label>
            <div class="row g-3">
                <div class="col-md-6">
                    <div class="form-check">
                        <input class="form-check-input" 
                               type="checkbox" 
                               name="powerUps" 
                               id="powerUps">
                        <label class="form-check-label" for="powerUps">
                            Enable Power-ups
                        </label>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-check">
                        <input class="form-check-input" 
                               type="checkbox" 
                               name="spectators" 
                               id="spectators">
                        <label class="form-check-label" for="spectators">
                            Allow Spectators
                        </label>
                    </div>
                </div>
            </div>
        </div>
    `;
}