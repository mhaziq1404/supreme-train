export function ChatItem({
    user = {},          // Default to empty object if user is undefined
    lastMessage = {},   // Default to empty object if lastMessage is undefined
    unreadCount = 0,
    isActive = false
  }) {
    // Safely handle user fields with fallback values
    const userName = user.name || 'Unknown User';
    const userAvatar = user.avatar || 'https://via.placeholder.com/40';
    const userStatusClass = user.status === 'online' ? 'success' : 'secondary';
  
    // Handle lastMessage fields
    const messageContent = lastMessage.content || '';
    const formattedTime = lastMessage.timestamp
      ? formatMessageTime(lastMessage.timestamp)
      : '';
  
    return `
      <div 
        class="chat-item p-3 border-bottom ${isActive ? 'active bg-light' : ''}" 
        role="button"
        data-user-id="${user.id || ''}"
      >
        <div class="d-flex">
          <div class="position-relative">
            <img 
              src="${userAvatar}" 
              class="rounded-circle" 
              alt="${userName}"
              width="40" 
              height="40"
            >
            <span class="position-absolute bottom-0 end-0 bg-${user.status === 'online' ? 'success' : 'secondary'} rounded-circle" style="width: 10px; height: 10px;"></span>
          </div>
          <div class="ms-3 flex-grow-1">
            <div class="d-flex justify-content-between align-items-center">
              <h6 class="mb-0">${userName}</h6>
              <small class="text-muted">${formattedTime}</small>
            </div>
            <div class="d-flex justify-content-between align-items-center">
              <small class="text-muted">${messageContent}</small>
              ${unreadCount 
                ? `<span class="badge rounded-pill bg-primary">${unreadCount}</span>` 
                : ''
              }
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  /**
   * Formats a given timestamp to a user-friendly string:
   * - Same day: returns HH:MM (e.g., "03:45 PM")
   * - 1 day difference: "Yesterday"
   * - Less than a week: "X days ago"
   * - Otherwise: returns the locale date string (e.g., "3/15/2023")
   */
  function formatMessageTime(timestamp) {
    if (!timestamp) return '';
  
    const date = new Date(timestamp);
    // If the date is invalid, return an empty string (or handle as needed)
    if (isNaN(date.getTime())) return '';
  
    const now = new Date();
    const diff = now - date; // difference in ms
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
    if (days === 0) {
      // Same day: just show local time in HH:MM format
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (days === 1) {
      return 'Yesterday';
    }
    if (days < 7) {
      return `${days} days ago`;
    }
    return date.toLocaleDateString();
  }
  