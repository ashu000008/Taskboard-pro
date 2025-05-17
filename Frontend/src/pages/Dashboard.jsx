import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile } from '../services/profileService';
import AssignedTasks from '../components/dashboard/AssignedTasks';
import './Dashboard.css';

function Dashboard() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileData = await getUserProfile();
        setProfile(profileData);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="dashboard">
      {/* Profile Section */}
      <div className="profile-section">
        <div className="profile-header">
          {profile?.photoURL ? (
            <img
              src={profile.photoURL}
              alt="Profile"
              className="profile-avatar"
            />
          ) : (
            <div className="profile-avatar-placeholder">
              {profile?.name?.charAt(0)}
            </div>
          )}
          <div className="profile-info">
            <h1>{profile?.name || 'User'}</h1>
   
          </div>
        </div>
      </div>

      {/* Assigned Tasks Section */}
      <div className="section">
        <AssignedTasks />
      </div>
    </div>
  );
}

export default Dashboard;