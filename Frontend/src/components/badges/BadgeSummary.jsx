import { useState, useEffect } from 'react';
import { getUserProfile } from '../../services/profileService';
import BadgeCard from './BadgeCard';
import './Badges.css';

function BadgeSummary() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profile = await getUserProfile();
        setUserProfile(profile);
        setError(null);
      } catch (err) {
        setError('Failed to load user profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);
  
  if (loading) {
    return <div className="loading-spinner">Loading badges...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  if (!userProfile || !userProfile.badges) {
    return <div className="empty-badges">No badge information available</div>;
  }
  
  const { badges } = userProfile;
  const badgeTypes = Object.entries(badges.types || {}).filter(([_, count]) => count > 0);
  
  return (
    <div className="badges-summary">
      <div className="badges-summary-header">
        <h2>Your Achievements</h2>
        <div className="total-badges">
          <span className="total-badge-icon">🏅</span>
          <span className="total-badge-count">{badges.total || 0}</span>
          <span className="total-badge-label">Total Badges</span>
        </div>
      </div>
      
      {badgeTypes.length > 0 ? (
        <div className="badge-cards">
          {badgeTypes.map(([type, count]) => (
            <BadgeCard key={type} type={type} count={count} />
          ))}
        </div>
      ) : (
        <div className="empty-badges">
          <p>You haven't earned any badges yet.</p>
          <p>Complete tasks to earn recognition!</p>
        </div>
      )}
    </div>
  );
}

export default BadgeSummary;
