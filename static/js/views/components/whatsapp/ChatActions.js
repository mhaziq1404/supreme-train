export function ChatActions({ isBlocked = false }) {
    const blockBtnLabel = isBlocked ? 'Unblock User' : 'Block User';
    const blockBtnIcon = isBlocked ? 'bi-slash-circle-fill' : 'bi-slash-circle';

    return `
        <div class="dropdown ms-auto" id="chatActions">
            <button class="btn btn-light rounded-circle" type="button" data-bs-toggle="dropdown">
                <i class="bi bi-three-dots-vertical"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
                <li>
                    <button class="dropdown-item" id="toggleBlockBtn">
                        <i class="${blockBtnIcon} me-2"></i>
                        <span>${blockBtnLabel}</span>
                    </button>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                    <button class="dropdown-item text-danger">
                        <i class="bi bi-trash me-2"></i>
                        Clear Chat
                    </button>
                </li>
            </ul>
        </div>
    `;
}