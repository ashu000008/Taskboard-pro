import './Badges.css';

const badgeIcons = {
  taskMaster: '🏆',
  problemSolver: '🔍',
  teamPlayer: '👥',
  productivityStar: '⭐',
  fastCompleter: '⚡',
  default: '🏅'
};

const badgeTitles = {
  taskMaster: 'Task Master',
  problemSolver: 'Problem Solver',
  teamPlayer: 'Team Player',
  productivityStar: 'Productivity Star',
  fastCompleter: 'Fast Completer',
};

const badgeDescriptions = {
  taskMaster: 'Completed tasks efficiently',
  problemSolver: 'Resolved issues and challenges',
  teamPlayer: 'Collaborated well with team members',
  productivityStar: 'Exceptional productivity',
  fastCompleter: 'Completed tasks before deadlines',
};

function BadgeCard({ type, count }) {
  const title = badgeTitles[type] || type;
  const icon = badgeIcons[type] || badgeIcons.default;
  const description = badgeDescriptions[type] || '';
  
  return (
    <div className="badge-card">
      <div className="badge-icon-large">{icon}</div>
      <div className="badge-info">
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="badge-count">
          <span>Earned:</span> <strong>{count}</strong>
        </div>
      </div>
    </div>
  );
}

export default BadgeCard;
