import { useState, useEffect } from 'react';
import { getUserBadges } from '../../services/automationService';
import './Badges.css';

function BadgeList() {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        setLoading(true);
        const data = await getUserBadges();
        setBadges(data);
        setError(null);
      } catch (err) {
        setError('Failed to load badges');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, []);

  if (loading) {
    return <div className="loading-spinner">Loading badges...</div>;
  }

  return (
    <div className="badges-container">
      <div className="badges-header">
        <h2>Your Badges</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      {badges.length === 0 ? (
        <div className="empty-badges">
          <p>You haven't earned any badges yet.</p>
          <p className="hint">Complete tasks to earn badges!</p>
        </div>
      ) : (
        <div className="badge-grid">
          {badges.map((badge) => (
            <div key={badge._id} className="badge-item">
              <div className="badge-icon">🏆</div>
              <div className="badge-details">
                <h3>{badge.name}</h3>
                <p>{badge.description}</p>
                <div className="badge-date">
                  {new Date(badge.awardedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BadgeList;
