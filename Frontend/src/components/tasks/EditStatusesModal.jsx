import { useState } from 'react';
import { updateProjectStatuses } from '../../services/taskService';
import './Tasks.css';

function EditStatusesModal({ project, onClose, onStatusesUpdated }) {
  const [statuses, setStatuses] = useState([...project.statuses]);
  const [newStatus, setNewStatus] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleAddStatus = () => {
    if (!newStatus.trim()) return;
    
    if (statuses.includes(newStatus.trim())) {
      setError('This status already exists');
      return;
    }
    
    setStatuses([...statuses, newStatus.trim()]);
    setNewStatus('');
    setError('');
  };
  
  const handleRemoveStatus = (indexToRemove) => {
    if (statuses.length <= 1) {
      setError('Project must have at least one status');
      return;
    }
    
    setStatuses(statuses.filter((_, index) => index !== indexToRemove));
  };
  
  const handleMoveUp = (index) => {
    if (index === 0) return;
    
    const newStatuses = [...statuses];
    [newStatuses[index - 1], newStatuses[index]] = [newStatuses[index], newStatuses[index - 1]];
    setStatuses(newStatuses);
  };
  
  const handleMoveDown = (index) => {
    if (index === statuses.length - 1) return;
    
    const newStatuses = [...statuses];
    [newStatuses[index], newStatuses[index + 1]] = [newStatuses[index + 1], newStatuses[index]];
    setStatuses(newStatuses);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (statuses.length === 0) {
      setError('Project must have at least one status');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await updateProjectStatuses(project._id, statuses);
      onStatusesUpdated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update statuses');
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Project Statuses</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="status-list">
            {statuses.map((status, index) => (
              <div key={index} className="status-item">
                <span>{status}</span>
                <div className="status-actions">
                  <button 
                    type="button"
                    className="icon-btn"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                  >
                    ↑
                  </button>
                  <button 
                    type="button"
                    className="icon-btn"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === statuses.length - 1}
                  >
                    ↓
                  </button>
                  <button 
                    type="button"
                    className="icon-btn remove"
                    onClick={() => handleRemoveStatus(index)}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="add-status-form">
            <div className="form-row">
              <input
                type="text"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                placeholder="New status name"
              />
              <button 
                type="button"
                className="add-status-btn"
                onClick={handleAddStatus}
              >
                Add
              </button>
            </div>
          </div>
          
          <div className="note">
            <strong>Note:</strong> Tasks in removed statuses will be moved to the first status.
          </div>
          
          <div className="modal-actions">
            <button 
              type="button" 
              className="cancel-btn" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Statuses'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditStatusesModal;
