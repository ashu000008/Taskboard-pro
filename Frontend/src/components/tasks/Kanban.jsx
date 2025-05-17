import { useState, useEffect } from 'react';
import { getProjectTasks, updateTaskStatus } from '../../services/taskService';
import TaskCard from './TaskCard';
import NewTaskModal from './NewTaskModal';
import EditStatusesModal from './EditStatusesModal';
import TaskDetailModal from './TaskDetailModal';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import './Tasks.css';

function Kanban({ project, isOwner }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showEditStatusesModal, setShowEditStatusesModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const { currentUser } = useAuth();
  const { socket, joinProject, leaveProject } = useSocket();
  
  const isProjectOwner = () => {
    return project.members.some(
      member => member.userId === currentUser?.uid && member.role === 'owner'
    );
  };
  
  // Enhance tasks with project data
  const enhanceTasksWithProjectData = (tasks) => {
    return tasks.map(task => ({
      ...task,
      project: {
        _id: project._id,
        title: project.title,
        statuses: project.statuses,
        members: project.members
      }
    }));
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getProjectTasks(project._id);
      // Enhance tasks with project data
      const enhancedTasks = enhanceTasksWithProjectData(data);
      console.log('Fetched tasks:', enhancedTasks);
      setTasks(enhancedTasks);
      setError(null);
    } catch (err) {
      setError('Failed to load tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTasks();
    
    // Join the project socket room
    joinProject(project._id);
    
    // Set up socket event listeners for real-time updates
    if (socket) {
      socket.on('task-created', (newTask) => {
        if (newTask.projectId === project._id) {
          setTasks(prevTasks => [...prevTasks, newTask]);
        }
      });
      
      socket.on('task-updated', (updatedTask) => {
        if (updatedTask.projectId === project._id) {
          setTasks(prevTasks => 
            prevTasks.map(task => 
              task._id === updatedTask._id ? updatedTask : task
            )
          );
        }
      });
      
      socket.on('task-deleted', ({ taskId, projectId }) => {
        if (projectId === project._id) {
          setTasks(prevTasks => 
            prevTasks.filter(task => task._id !== taskId)
          );
        }
      });
      
      socket.on('comment-added', ({ taskId, projectId }) => {
        if (projectId === project._id) {
          // Just trigger a refresh of the affected task
          fetchTasks();
        }
      });
    }
    
    // Clean up
    return () => {
      leaveProject(project._id);
      if (socket) {
        socket.off('task-created');
        socket.off('task-updated');
        socket.off('task-deleted');
        socket.off('comment-added');
      }
    };
  }, [project._id, socket]);
  
  const handleDragStart = (e, taskId) => {
    const task = tasks.find(t => t._id === taskId);
    console.log('Drag started for task:', task);
    
    // Add the task ID as data
    e.dataTransfer.setData('taskId', taskId);
    
    // Give visual feedback
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  
  const handleDrop = async (e, status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    
    if (!taskId) return;
    
    console.log(`Attempting to move task ${taskId} to ${status}`);
    
    try {
      await updateTaskStatus(taskId, status);
      console.log('Status updated successfully');
      fetchTasks();
    } catch (err) {
      console.error('Error moving task:', err);
    }
  };
  
  const handleTaskCreated = () => {
    setShowNewTaskModal(false);
    fetchTasks();
  };
  
  const handleStatusesUpdated = () => {
    setShowEditStatusesModal(false);
    fetchTasks();
  };

  const handleTaskClick = (task) => {
    // Ensure the task has project information
    const taskWithProject = {
      ...task,
      project: project
    };
    setSelectedTask(taskWithProject);
  };
  
  const handleCloseTaskDetail = () => {
    setSelectedTask(null);
  };
  
  const handleTaskUpdated = () => {
    fetchTasks();
    setSelectedTask(null);
  };
  
  if (loading) {
    return <div className="loading-spinner">Loading tasks...</div>;
  }
  
  // Group tasks by status
  const tasksByStatus = {};
  project.statuses.forEach(status => {
    tasksByStatus[status] = tasks.filter(task => task.status === status);
  });
  
  return (
    <div className="kanban-container">
      <div className="kanban-header">
        <h2>Tasks</h2>
        <div className="kanban-actions">
          {isOwner && (
            <>
              <button 
                className="edit-statuses-btn"
                onClick={() => setShowEditStatusesModal(true)}
              >
                Edit Statuses
              </button>
              <button 
                className="new-task-btn"
                onClick={() => setShowNewTaskModal(true)}
              >
                + New Task
              </button>
            </>
          )}
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="kanban-board">
        {project.statuses.map(status => (
          <div 
            key={status}
            className="kanban-column"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}
          >
            <div className="column-header">
              <h3>{status}</h3>
              <span className="task-count">{tasksByStatus[status]?.length || 0}</span>
            </div>
            <div className="task-list">
              {tasksByStatus[status] && tasksByStatus[status].length > 0 ? (
                tasksByStatus[status].map(task => (
                  <TaskCard 
                    key={task._id} 
                    task={task}
                    onTaskUpdated={fetchTasks}
                    onDragStart={handleDragStart}
                    onClick={handleTaskClick}
                  />
                ))
              ) : (
                <div className="empty-column">No tasks</div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {isOwner && showNewTaskModal && (
        <NewTaskModal 
          project={project}
          onClose={() => setShowNewTaskModal(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}
      
      {isOwner && showEditStatusesModal && (
        <EditStatusesModal
          project={project}
          onClose={() => setShowEditStatusesModal(false)}
          onStatusesUpdated={handleStatusesUpdated}
        />
      )}
      
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={handleCloseTaskDetail}
          onTaskUpdated={handleTaskUpdated}
        />
      )}
    </div>
  );
}

export default Kanban;
