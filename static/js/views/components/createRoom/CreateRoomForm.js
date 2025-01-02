import { BasicSettings } from './BasicSettings.js';
import { GameSettings } from './GameSettings.js';
import { ActionButtons } from './ActionButtons.js';

export function CreateRoomForm() {
    return `
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <div class="card border-0 shadow-sm">
                    <div class="card-header bg-primary text-white py-4">
                        <h3 class="mb-0">Create Game Room</h3>
                        <p class="mb-0 text-light">Set up your game room preferences</p>
                    </div>
                    <div class="card-body p-4">
                        <form id="createRoomForm">
                            ${BasicSettings()}
                            ${ActionButtons()}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
}