import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, getUserStats } from '../services/profileService';
import { getUserProjects } from '../services/projectService'; // <-- You need this service
import AssignedTasks from '../components/dashboard/AssignedTasks';

import { Assessment, Assignment, People, TimelineRounded } from '@mui/icons-material';
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
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [profileData, statsData, projectsData] = await Promise.all([
          getUserProfile(),
          getUserStats(),
          getUserProjects()
        ]);
        setProfile(profileData);
        setStats(statsData);
        setProjects(projectsData);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const progressPercentage = stats?.tasksCompleted && stats?.totalTasks
    ? Math.round((stats.tasksCompleted / stats.totalTasks) * 100)
    : 0;

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error-message">{error}</div>;

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
          <Assessment className="stat-icon" />
          <div className="stat-info">
            <h3>Projects</h3>
            <p>{stats?.projectsCount || 0}</p>
            <span className="stat-label">Active Projects</span>
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
      </div>

      {/* Side-by-side Tasks and Projects */}
      <div className="dashboard-main-sections">
        {/* Tasks Overview */}
        <div className="tasks-overview">
       
          <div className="tasks-container">
            <AssignedTasks />
          </div>
        </div>
        {/* Projects Overview */}
        <div className="projects-overview">
          <h2>My Projects</h2>
          <div className="projects-list">
            {projects.length === 0 ? (
              <div className="empty-state">
                <p>You don't have any projects yet.</p>
              </div>
            ) : (
              <ul>
                {projects.map(project => (
                  <li key={project._id} className="project-item">
                    {/* You can use <ProjectCard project={project} /> if you have a component */}
                    <span className="project-title">{project.title}</span>
                    <span className="project-meta">{project.members.length} members</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;