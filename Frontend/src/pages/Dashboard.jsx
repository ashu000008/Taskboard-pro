import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, getUserStats } from '../services/profileService';
import AssignedTasks from '../components/dashboard/AssignedTasks';
import { 
  Assessment, 
  Assignment, 
  People, 
  TimelineRounded 
} from '@mui/icons-material';
import './Dashboard.css';

function Dashboard() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    tasksCompleted: 0,
    totalTasks: 0,
    projectsCount: 0,
    teamMembersCount: 0,
    progressPercentage: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [profileData, statsData] = await Promise.all([
          getUserProfile(),
          getUserStats()
        ]);
        
        console.log('Dashboard data:', { profileData, statsData });
        
        setProfile(profileData);
        setStats(statsData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchDashboardData();
  }, []);

  
  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error-message">{error}</div>;

  // Calculate progress percentage
  const progressPercentage = stats?.tasksCompleted && stats?.totalTasks 
    ? Math.round((stats.tasksCompleted / stats.totalTasks) * 100)
    : 0;

  return (
    <div className="dashboard-container">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <h1>Welcome back, {profile?.name || 'User'}</h1>
          <p>Here's your activity overview</p>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <Assignment className="stat-icon" />
          <div className="stat-info">
            <h3>Tasks</h3>
            <p>{stats?.tasksCompleted || 0} / {stats?.totalTasks || 0}</p>
            <span className="stat-label">Completed</span>
          </div>
        </div>
        <div className="stat-card">
          <People className="stat-icon" />
          <div className="stat-info">
            <h3>Team Members</h3>
            <p>{stats?.teamMembersCount || 0}</p>
            <span className="stat-label">Active Members</span>
          </div>
        </div>
        <div className="stat-card">
          <TimelineRounded className="stat-icon" />
          <div className="stat-info">
            <h3>Progress</h3>
            <p>{progressPercentage}%</p>
            <span className="stat-label">Task Completion</span>
          </div>
        </div>
        <div className="stat-card">
          <Assessment className="stat-icon" />
          <div className="stat-info">
            <h3>Projects</h3>
            <p>{stats?.projectsCount || 0}</p>
            <span className="stat-label">Active Projects</span>
          </div>
        </div>
      </div>

      {/* Tasks Overview */}
      <div className="tasks-overview">
  
        <div className="tasks-container">
          <AssignedTasks />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;