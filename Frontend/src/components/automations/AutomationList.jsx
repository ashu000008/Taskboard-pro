import { useState, useEffect } from 'react';
import { getProjectAutomations, deleteAutomation } from '../../services/automationService.js';
import AutomationForm from './AutomationForm';
import './Automations.css';

function AutomationList({ project, isOwner }) {
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewAutomationForm, setShowNewAutomationForm] = useState(false);
  const [editingAutomation, setEditingAutomation] = useState(null);

  const fetchAutomations = async () => {
    try {
      setLoading(true);
      const data = await getProjectAutomations(project._id);
      setAutomations(data);
      setError(null);
    } catch (err) {
      setError('Failed to load automations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAutomations();
  }, [project._id]);

  const handleDeleteAutomation = async (automationId) => {
    if (window.confirm('Are you sure you want to delete this automation?')) {
      try {
        await deleteAutomation(automationId);
        fetchAutomations();
      } catch (err) {
        setError('Failed to delete automation');
        console.error(err);
      }
    }
  };

  const handleAutomationCreated = () => {
    setShowNewAutomationForm(false);
    fetchAutomations();
  };

  const handleAutomationUpdated = () => {
    setEditingAutomation(null);
    fetchAutomations();
  };

  if (loading) {
    return <div className="loading-spinner">Loading automations...</div>;
  }

  const renderTriggerDetails = (trigger) => {
    switch (trigger.type) {
      case 'STATUS_CHANGE':
        return (
          <span>When task moves from <strong>{trigger.fromStatus}</strong> to <strong>{trigger.toStatus}</strong></span>
        );
      case 'ASSIGNMENT_CHANGE':
        return (
          <span>When task is assigned to <strong>{trigger.assigneeEmail}</strong></span>
        );
      case 'DUE_DATE_PASSED':
        return (
          <span>When task due date passes</span>
        );
      default:
        return <span>Unknown trigger type</span>;
    }
  };

  const renderActionDetails = (action) => {
    switch (action.type) {
      case 'ASSIGN_BADGE':
        return (
          <span>Assign badge: <strong>{action.badgeName}</strong></span>
        );
      case 'MOVE_TASK':
        return (
          <span>Move task to status: <strong>{action.targetStatus}</strong></span>
        );
      case 'SEND_NOTIFICATION':
        return (
          <span>Send notification: <strong>{action.notificationText}</strong></span>
        );
      default:
        return <span>Unknown action type</span>;
    }
  };

  return (
    <div className="automations-container">
      <div className="automations-header">
        <h2>Workflow Automations</h2>
        {isOwner && (
          <button 
            className="create-automation-btn"
            onClick={() => setShowNewAutomationForm(true)}
          >
            + New Automation
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {automations.length === 0 ? (
        <div className="empty-automations">
          <p>No automations set up yet.</p>
          {isOwner && (
            <button 
              className="create-automation-btn"
              onClick={() => setShowNewAutomationForm(true)}
            >
              Create your first automation
            </button>
          )}
        </div>
      ) : (
        <div className="automation-list">
          {automations.map((automation) => (
            <div 
              key={automation._id} 
              className={`automation-card ${!automation.isActive ? 'inactive' : ''}`}
            >
              <div className="automation-header">
                <h3>{automation.name}</h3>
                <div className="automation-status">
                  <span className={`status-indicator ${automation.isActive ? 'active' : 'inactive'}`}>
                    {automation.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              <div className="automation-details">
                <div className="automation-section">
                  <div className="section-label">Trigger:</div>
                  <div className="section-content">
                    {renderTriggerDetails(automation.trigger)}
                  </div>
                </div>
                
                <div className="automation-section">
                  <div className="section-label">Action:</div>
                  <div className="section-content">
                    {renderActionDetails(automation.action)}
                  </div>
                </div>
              </div>
              
              {isOwner && (
                <div className="automation-actions">
                  <button 
                    className="edit-btn" 
                    onClick={() => setEditingAutomation(automation)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-btn" 
                    onClick={() => handleDeleteAutomation(automation._id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {isOwner && showNewAutomationForm && (
        <AutomationForm
          project={project}
          onClose={() => setShowNewAutomationForm(false)}
          onAutomationCreated={handleAutomationCreated}
        />
      )}

      {isOwner && editingAutomation && (
        <AutomationForm
          project={project}
          automation={editingAutomation}
          isEditing={true}
          onClose={() => setEditingAutomation(null)}
          onAutomationUpdated={handleAutomationUpdated}
        />
      )}
    </div>
  );
}

export default AutomationList;
