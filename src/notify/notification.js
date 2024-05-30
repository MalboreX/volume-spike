class Notification {
    notificationProvider;
    signalsCache = new Map();

    constructor(notificationProvider) {
        this.notificationProvider = notificationProvider;
    }

    async notify(key, text) {
        this.signalsCache.set(key, true);
        await this.notificationProvider.sendNotify(text);
    }

    async notifyIfNotHappened(key, text) {
        if (this.hasSent(key)) return;
        await this.notify(key, text);
    }

    hasSent(key) {
        return this.signalsCache.has(key);
    }
}

module.exports = Notification;