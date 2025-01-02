export function PendingRequests() {
    return `
        <div class="card mb-4">
            <div class="card-header bg-warning bg-gradient text-dark">
                <h5 class="mb-0">Pending Requests</h5>
            </div>
            <div class="card-body p-0">
                <div id="pendingRequestsList" class="list-group list-group-flush">
                    <!-- Requests will be dynamically added here -->
                </div>
            </div>
        </div>
    `;
}