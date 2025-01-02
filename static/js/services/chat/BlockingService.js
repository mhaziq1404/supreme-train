export class BlockingService {
    constructor() {
        this.blockedUsers = new Set();
    }

    blockUser(userId) {
        this.blockedUsers.add(userId);
        this.saveBlockedUsers();
    }

    unblockUser(userId) {
        this.blockedUsers.delete(userId);
        this.saveBlockedUsers();
    }

    isBlocked(userId) {
        this.loadBlockedUsers();
        //console.log(this.blockedUsers);
        return this.blockedUsers.has(userId);
    }

    toggleBlock(userId) {
        if (this.isBlocked(userId)) {
            this.unblockUser(userId);
        } else {
            this.blockUser(userId);
        }
        return this.isBlocked(userId);
    }

    saveBlockedUsers() {
        localStorage.setItem('blockedUsers', JSON.stringify(Array.from(this.blockedUsers)));
    }

    loadBlockedUsers() {
        const saved = localStorage.getItem('blockedUsers');
        if (saved) {
            this.blockedUsers = new Set(JSON.parse(saved));
        }
    }
}

export const blockingService = new BlockingService();