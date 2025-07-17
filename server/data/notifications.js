export const notifications = [];

export function addNotification(userId, message) {
  notifications.push({
    id: notifications.length + 1,
    userId,
    message
  });
}