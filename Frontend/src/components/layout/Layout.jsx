import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { getUserNotifications, markNotificationRead } from '../../services/automationService';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logOut } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Fetch notifications from the backend
  const fetchNotifications = async () => {
    try {
      const data = await getUserNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown((prev) => !prev);
  };

  const handleViewProfile = () => {
    navigate('/profile');
    setShowProfileDropdown(false);
  };

  const handleSignOut = async () => {
    try {
      await logOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id ? { ...notification, isRead: true } : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <Link to="/" className="logo-link">
            <h2>TaskBoard Pro</h2>
          </Link>
        </div>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
            Dashboard
          </Link>
          <Link to="/projects" className={location.pathname === '/projects' ? 'active' : ''}>
            Projects
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Navigation */}
        <header className="top-nav">
          <div className="nav-actions">
            {/* Notifications */}
            <div className="notification-container">
              <button
                className="notification-btn"
                onClick={toggleNotifications}
                title="Notifications"
              >
                <NotificationsIcon />
              </button>
              {showNotifications && (
                <div className="notification-dropdown">
                  {notifications.length === 0 ? (
                    <div className="notification-item">No notifications</div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification._id}
                        className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
                        onClick={() => handleMarkAsRead(notification._id)}
                      >
                        <div className="notification-title">{notification.title}</div>
                        <div className="notification-message">{notification.message}</div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="profile-container">
              <button
                className="profile-btn"
                onClick={toggleProfileDropdown}
                title="Profile"
              >
                {currentUser?.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="Profile"
                    className="profile-avatar"
                  />
                ) : (
                  <AccountCircleIcon className="profile-icon" />
                )}
              </button>
              {showProfileDropdown && (
                <div className="profile-dropdown">
                  <button className="dropdown-item" onClick={handleViewProfile}>
                    View Profile
                  </button>
                  <button className="dropdown-item" onClick={handleSignOut}>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="content">{children}</main>
      </div>
    </div>
  );
};

export default Layout;