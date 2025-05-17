import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import NotificationList from '../components/notifications/NotificationList';
import BadgeSummary from '../components/badges/BadgeSummary';
import BadgeList from '../components/badges/BadgeList';
import './UserProfile.css';

function UserProfile() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('notifications');

  return (
    <div className="user-profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar-section">
          {currentUser?.photoURL ? (
            <img
              src={currentUser.photoURL}
              alt="Profile"
              className="profile-avatar"
            />
          ) : (
            <div className="profile-avatar-placeholder">
              {currentUser?.displayName?.charAt(0)}
            </div>
          )}
        </div>
        <div className="profile-info">
          <h1>{currentUser?.displayName || 'User'}</h1>
          <p>{currentUser?.email}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="profile-tabs">
        <button
          className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          Notifications
        </button>
        <button
          className={`tab-btn ${activeTab === 'badges' ? 'active' : ''}`}
          onClick={() => setActiveTab('badges')}
        >
          Badges
        </button>
        <button
          className={`tab-btn ${activeTab === 'badgeHistory' ? 'active' : ''}`}
          onClick={() => setActiveTab('badgeHistory')}
        >
          Badge History
        </button>
      </div>

      {/* Tab Content */}
      <div className="profile-content">
        {activeTab === 'notifications' && <NotificationList />}
        {activeTab === 'badges' && <BadgeSummary />}
        {activeTab === 'badgeHistory' && <BadgeList />}
      </div>
    </div>
  );
}

export default UserProfile;