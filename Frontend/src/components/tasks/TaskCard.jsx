import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import TaskDetailModal from './TaskDetailModal';
import { useAuth } from '../../context/AuthContext';
import './Tasks.css';

function TaskCard({ task, onTaskUpdated, onDragStart, onClick }) {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { currentUser } = useAuth();
  
  // Check if current user can move this task (owner or assignee)
  const canMoveTask = () => {
    if (!currentUser) return false;
    
    // User is assigned this task
    if (task.assignee && task.assignee.userId === currentUser.uid) {
      console.log("Can move: User is assignee");
      return true;
    }
    
    // User is project owner
    if (task.project && task.project.members) {
      const isOwner = task.project.members.some(
        member => member.userId === currentUser.uid && member.role === 'owner'
      );
      
      if (isOwner) {
        console.log("Can move: User is project owner");
        return true;
      }
    }
    
    console.log("Cannot move: User is neither assignee nor owner");
    return false;
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };
  
  const handleTaskUpdated = () => {
    setShowDetailModal(false);
    if (onTaskUpdated) onTaskUpdated();
  };
  
  const handleClick = (e) => {
    if (onClick) {
      onClick(task);
    } else {
      setShowDetailModal(true);
    }
  };
  
  const handleDragStart = (e) => {
    const canMove = canMoveTask();
    console.log(`Task ${task._id} draggable: ${canMove}`);
    
    if (canMove) {
      onDragStart(e, task._id);
    } else {
      e.preventDefault();
    }
  };
  
  return (
    <>
      <div 
        className={`task-card ${canMoveTask() ? 'draggable' : ''}`}
        draggable={canMoveTask()}
        onDragStart={handleDragStart}
        onClick={handleClick}
      >
        <h4 className="task-title">{task.title}</h4>
        
        {task.description && (
          <p className="task-description">{task.description.substring(0, 50)}
            {task.description.length > 50 && '...'}
          </p>
        )}
        
        <div className="task-meta">
          {task.dueDate && (
            <span className="due-date">Due {formatDate(task.dueDate)}</span>
          )}
          
          {task.assignee?.email && (
            <span className="assignee">
              {task.assignee.email.split('@')[0]}
              {task.assignee.userId === currentUser?.uid && 
                <span className="assigned-to-me" title="Assigned to me"> ✓</span>
              }
            </span>
          )}
        </div>
      </div>
      
      {showDetailModal && !onClick && (
        <TaskDetailModal
          task={task}
          onClose={() => setShowDetailModal(false)}
          onTaskUpdated={handleTaskUpdated}
        />
      )}
    </>
  );
}

export default TaskCard;
