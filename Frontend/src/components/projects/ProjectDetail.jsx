import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectById, updateProject, deleteProject } from '../../services/projectService';
import { getTaskById } from '../../services/taskService';
import MembersList from './MembersList';
import InviteMemberModal from './InviteMemberModal';
import Kanban from '../tasks/Kanban';
import TaskDetailModal from '../tasks/TaskDetailModal';
import AutomationList from '../automations/AutomationList';
import { useAuth } from '../../context/AuthContext';
import { getTaskIdFromUrl } from '../../utils/urlUtils';
import './ProjectDetail.css';

function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [selectedTask, setSelectedTask] = useState(null);
  const [taskLoading, setTaskLoading] = useState(false);

  const { currentUser } = useAuth();

  const fetchProject = async () => {
    try {
      setLoading(true);
      const projectData = await getProjectById(projectId);
      setProject(projectData);
      setTitle(projectData.title);
      setDescription(projectData.description || '');
      setError(null);
    } catch (err) {
      setError('Failed to fetch project details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();

    const taskId = getTaskIdFromUrl();
    if (taskId) {
      setTaskLoading(true);
      getTaskById(taskId)
        .then((task) => {
          setSelectedTask(task);
        })
        .catch((err) => {
          console.error('Error loading task:', err);
        })
        .finally(() => {
          setTaskLoading(false);
        });
    }
  }, [projectId]);

  const handleSaveChanges = async () => {
    try {
      await updateProject(projectId, { title, description });
      setIsEditing(false);
      fetchProject();
    } catch (err) {
      setError('Failed to update project');
      console.error(err);
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await deleteProject(projectId);
        navigate('/projects');
      } catch (err) {
        setError('Failed to delete project');
        console.error(err);
      }
    }
  };

  const isProjectOwner = () => {
    if (!project) return false;
    return project.members.some(
      (member) => member.userId === currentUser?.uid && member.role === 'owner'
    );
  };

  const handleMemberInvited = () => {
    setShowInviteModal(false);
    fetchProject();
  };

  const handleTaskModalClosed = () => {
    setSelectedTask(null);
    navigate(`/projects/${projectId}`, { replace: true });
  };

  if (loading) {
    return <div className="loading-spinner">Loading project details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!project) {
    return <div className="not-found">Project not found</div>;
  }

  return (
    <div className="project-detail-container">
      {/* Header Section */}
      <div className="project-detail-header">
        <div className="back-button" onClick={() => navigate('/projects')}>
          &larr; Back to Projects
        </div>

        {isEditing ? (
          <div className="project-edit-form">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="project-title-input"
              placeholder="Project Title"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="project-description-input"
              placeholder="Project Description"
              rows={3}
            ></textarea>
            <div className="edit-actions">
              <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
              <button className="save-btn" onClick={handleSaveChanges}>
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="project-info">
            <h1>{project?.title}</h1>
            <p className="project-description">{project?.description}</p>
            {isProjectOwner() && (
              <div className="project-actions">
                <button className="edit-btn" onClick={() => setIsEditing(true)}>
                  Edit Project
                </button>
                <button className="delete-btn" onClick={handleDeleteProject}>
                  Delete Project
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Members Section */}
      <div className="project-members-section">
        <div className="section-header">
          <h2>Project Members</h2>
          {isProjectOwner() && (
            <button className="invite-btn" onClick={() => setShowInviteModal(true)}>
              + Invite Member
            </button>
          )}
        </div>
        <MembersList
          members={project?.members || []}
          projectId={projectId}
          onMemberRemoved={fetchProject}
          isOwner={isProjectOwner()}
        />
      </div>

      {showInviteModal && (
        <InviteMemberModal
          projectId={projectId}
          onClose={() => setShowInviteModal(false)}
          onMemberInvited={handleMemberInvited}
        />
      )}

      {/* Tasks Section */}
      {project && (
        <div className="project-tasks-section">
          <Kanban project={project} isOwner={isProjectOwner()} />
        </div>
      )}

      {/* Automations Section */}
      {project && isProjectOwner() && (
        <div className="project-automations-section">
          <AutomationList project={project} isOwner={isProjectOwner()} />
        </div>
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={handleTaskModalClosed}
          onTaskUpdated={fetchProject}
        />
      )}
    </div>
  );
}

export default ProjectDetail;