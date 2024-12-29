import { SearchBar } from './SearchBar.js';

export function ChatList() {
    return `
        ${SearchBar()}
        <div class="overflow-auto" style="height: calc(85vh - 71px);">
            <div class="chat-list">
                ${generateChatItems()}
            </div>
        </div>
    `;
}

function generateChatItems() {
    return `
        <div class="text-center text-muted p-4">
            Loading chats...
        </div>
    `;
}