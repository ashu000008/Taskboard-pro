import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserProjects } from '../../services/projectService';
import NewProjectModal from './NewProjectModal';
import './Projects.css';

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const projectsData = await getUserProjects();
      setProjects(projectsData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProjects();
  }, []);
  
  const handleProjectCreated = () => {
    fetchProjects();
    setShowNewProjectModal(false);
  };
  
  if (loading) {
    return <div className="loading-spinner">Loading projects...</div>;
  }
  
  return (
    <div className="projects-container">
      <div className="projects-header">
        <h1>Your Projects</h1>
        <button 
          className="create-project-btn"
          onClick={() => setShowNewProjectModal(true)}
        >
          + New Project
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="projects-grid">
        {projects.length > 0 ? (
          projects.map(project => (
            <Link 
              to={`/projects/${project._id}`} 
              key={project._id}
              className="project-card"
            >
              <h3>{project.title}</h3>
              <p className="project-description">{project.description}</p>
              <div className="project-meta">
                <span>{project.members.length} members</span>
                <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))
        ) : (
          <div className="empty-projects">
            <p>You don't have any projects yet.</p>
            <button 
              className="create-project-btn"
              onClick={() => setShowNewProjectModal(true)}
            >
              Create your first project
            </button>
          </div>
        )}
      </div>
      
      {showNewProjectModal && (
        <NewProjectModal 
          onClose={() => setShowNewProjectModal(false)}
          onProjectCreated={handleProjectCreated}
        />
      )}
    </div>
  );
}

export default ProjectList;
