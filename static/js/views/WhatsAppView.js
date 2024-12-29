import { initWhatsAppHandlers } from '../utils/whatsapp/whatsAppHandlers.js';
import { ChatList } from './components/whatsapp/ChatList.js';
import { ChatArea } from './components/whatsapp/ChatArea.js';
import { ChatHeader } from './components/whatsapp/ChatHeader.js';

export function WhatsAppView() {
    initWhatsAppHandlers()
        .catch(err => console.error('Error initializing WhatsAppHandlers:', err));

    return `
        <div class="chat-container card border-0 shadow-sm">
            <div class="row g-0 h-100">
                <!-- Contacts List -->
                <div class="col-md-4 chat-sidebar">
                    ${ChatList()}
                </div>

                <!-- Chat Area -->
                <div class="col-md-8">
                    ${ChatHeader()}
                    ${ChatArea()}
                </div>
            </div>
        </div>
    `;
}