export function LobbyChat() {
    return ``;
    return `
      <div class="card flex-grow-1 d-flex flex-column">
        <div class="card-header bg-info bg-gradient text-white">
          <h5 class="mb-0">Lobby Chat</h5>
        </div>
        <div class="card-body p-0 d-flex flex-column" style="min-height: 300px;">
          <div class="chat-messages p-3 flex-grow-1" style="overflow-y: auto;">
            <!-- Messages will be added here dynamically -->
          </div>
          <div class="p-3 border-top mt-auto">
            <div class="input-group">
              <input 
                type="text" 
                class="form-control" 
                placeholder="Type your message..." 
                id="lobbyChatInput"
                autocomplete="off"
              >
              <button class="btn btn-primary" type="button" id="lobbyChatSend">
                <i class="bi bi-send-fill"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }