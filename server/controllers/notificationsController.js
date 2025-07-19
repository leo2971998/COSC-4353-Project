// controllers/notificationsController.js
export const notifications = [
    { id: 1, userId: 1, message: "Event A", read: false },
    { id: 2, userId: 1, message: "Event B", read: false },
    { id: 3, userId: 2, message: "Event C", read: false }
  ];
  
  export const getAllNotifications = (req, res) => {
    res.json(notifications);
  };
  
  export const getNotificationsByUserId = (req, res) => {
    const { userId } = req.params;
    const userNotifications = notifications.filter(
      (n) => n.userId === parseInt(userId)
    );
    res.json(userNotifications);
  };
  
  export const createNotification = (req, res) => {
    const { userId, message } = req.body;
  
    if (!userId || !message) {
      return res.status(400).json({ error: "Missing fields" });
    }
  
    const newNotification = {
      id: Date.now(),
      userId: parseInt(userId),
      message,
      read: false,
    };
  
    notifications.push(newNotification);
    res.status(201).json(newNotification);
  };