import { useState, useEffect } from 'react';
import { getUserNotifications, markNotificationRead } from '../../services/automationService';
import { formatDistanceToNow } from 'date-fns';
import './Notifications.css';

function NotificationList() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getUserNotifications();
      setNotifications(data);
      setError(null);
    } catch (err) {
      setError('Failed to load notifications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Poll for new notifications every minute
    const interval = setInterval(fetchNotifications, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const handleMarkRead = async (notificationId) => {
    try {
      await markNotificationRead(notificationId);
      // Update the local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification._id === notificationId 
            ? { ...notification, isRead: true } 
            : notification
        )
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const formatTime = (timestamp) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  if (loading) {
    return <div className="loading-spinner">Loading notifications...</div>;
  }

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h2>Notifications</h2>
        {notifications.some(n => !n.isRead) && (
          <button className="mark-all-read-btn">
            Mark all as read
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {notifications.length === 0 ? (
        <div className="empty-notifications">
          <p>No notifications yet.</p>
        </div>
      ) : (
        <div className="notification-list">
          {notifications.map((notification) => (
            <div 
              key={notification._id} 
              className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
              onClick={() => !notification.isRead && handleMarkRead(notification._id)}
            >
              <div className="notification-icon">
                {notification.type === 'TASK' && <span>📝</span>}
                {notification.type === 'BADGE' && <span>🏆</span>}
                {notification.type === 'PROJECT' && <span>📂</span>}
                {notification.type === 'SYSTEM' && <span>ℹ️</span>}
              </div>
              <div className="notification-content">
                <div className="notification-title">{notification.title}</div>
                <div className="notification-message">{notification.message}</div>
                <div className="notification-time">{formatTime(notification.createdAt)}</div>
              </div>
              {!notification.isRead && (
                <div className="unread-indicator"></div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationList;
