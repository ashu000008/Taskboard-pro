import { useState } from 'react';
import { createAutomation, updateAutomation } from '../../services/automationService.js';

function AutomationForm({ project, automation = null, isEditing = false, onClose, onAutomationCreated, onAutomationUpdated }) {
  const [name, setName] = useState(automation?.name || '');
  const [triggerType, setTriggerType] = useState(automation?.trigger?.type || 'STATUS_CHANGE');
  const [fromStatus, setFromStatus] = useState(automation?.trigger?.fromStatus || project.statuses[0]);
  const [toStatus, setToStatus] = useState(automation?.trigger?.toStatus || project.statuses[0]);
  const [assigneeEmail, setAssigneeEmail] = useState(automation?.trigger?.assigneeEmail || '');
  const [actionType, setActionType] = useState(automation?.action?.type || 'MOVE_TASK');
  const [targetStatus, setTargetStatus] = useState(automation?.action?.targetStatus || project.statuses[0]);
  const [badgeName, setBadgeName] = useState(automation?.action?.badgeName || '');
  const [notificationText, setNotificationText] = useState(automation?.action?.notificationText || '');
  const [isActive, setIsActive] = useState(automation?.isActive ?? true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Automation name is required');
      return;
    }

    try {
      setIsSubmitting(true);

      const automationData = {
        projectId: project._id,
        name,
        isActive,
        trigger: { type: triggerType },
        action: { type: actionType },
      };

      if (triggerType === 'STATUS_CHANGE') {
        automationData.trigger.fromStatus = fromStatus;
        automationData.trigger.toStatus = toStatus;
      } else if (triggerType === 'ASSIGNMENT_CHANGE') {
        automationData.trigger.assigneeEmail = assigneeEmail;
      }

      if (actionType === 'MOVE_TASK') {
        automationData.action.targetStatus = targetStatus;
      } else if (actionType === 'ASSIGN_BADGE') {
        automationData.action.badgeName = badgeName;
      } else if (actionType === 'SEND_NOTIFICATION') {
        automationData.action.notificationText = notificationText;
      }

      if (isEditing) {
        await updateAutomation(automation._id, automationData);
        onAutomationUpdated();
      } else {
        await createAutomation(automationData);
        onAutomationCreated();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save automation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    modal: {
      backgroundColor: '#fff',
      borderRadius: '8px',
      width: '100%',
      maxWidth: '600px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      padding: '20px',
      overflow: 'hidden',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: '16px',
      borderBottom: '1px solid #e2e8f0',
      marginBottom: '16px',
    },
    title: {
      margin: 0,
      fontSize: '1.5rem',
      color: '#1e293b',
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer',
      color: '#64748b',
    },
    formGroup: {
      marginBottom: '16px',
    },
    label: {
      display: 'block',
      marginBottom: '6px',
      fontWeight: '600',
      color: '#1e293b',
    },
    input: {
      width: '100%',
      padding: '10px 12px',
      border: '1px solid #cbd5e1',
      borderRadius: '6px',
      fontSize: '1rem',
      backgroundColor: '#f9fafb',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    },
    textarea: {
      resize: 'vertical',
    },
    formRow: {
      display: 'flex',
      gap: '16px',
    },
    actions: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '12px',
      marginTop: '16px',
    },
    cancelButton: {
      backgroundColor: '#f1f5f9',
      color: '#64748b',
      border: 'none',
      padding: '10px 16px',
      borderRadius: '6px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease, color 0.2s ease',
    },
    submitButton: {
      backgroundColor: '#2563eb',
      color: '#fff',
      border: 'none',
      padding: '10px 16px',
      borderRadius: '6px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease, transform 0.2s ease',
    },
    errorMessage: {
      backgroundColor: '#fee2e2',
      color: '#b91c1c',
      padding: '8px 12px',
      borderRadius: '6px',
      marginBottom: '16px',
      textAlign: 'center',
      fontWeight: '500',
    },
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>{isEditing ? 'Edit Automation' : 'Create New Automation'}</h2>
          <button style={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div style={styles.errorMessage}>{error}</div>}

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="automationName">
              Automation Name *
            </label>
            <input
              style={styles.input}
              type="text"
              id="automationName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter a descriptive name"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="triggerType">
              When should this automation run?
            </label>
            <select
              style={styles.input}
              id="triggerType"
              value={triggerType}
              onChange={(e) => setTriggerType(e.target.value)}
            >
              <option value="STATUS_CHANGE">When task status changes</option>
              <option value="ASSIGNMENT_CHANGE">When task is assigned</option>
              <option value="DUE_DATE_PASSED">When task due date passes</option>
            </select>
          </div>

          {triggerType === 'STATUS_CHANGE' && (
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="fromStatus">
                  From Status
                </label>
                <select
                  style={styles.input}
                  id="fromStatus"
                  value={fromStatus}
                  onChange={(e) => setFromStatus(e.target.value)}
                >
                  {project.statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="toStatus">
                  To Status
                </label>
                <select
                  style={styles.input}
                  id="toStatus"
                  value={toStatus}
                  onChange={(e) => setToStatus(e.target.value)}
                >
                  {project.statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {triggerType === 'ASSIGNMENT_CHANGE' && (
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="assigneeEmail">
                Assigned To
              </label>
              <select
                style={styles.input}
                id="assigneeEmail"
                value={assigneeEmail}
                onChange={(e) => setAssigneeEmail(e.target.value)}
              >
                <option value="">Select a member</option>
                {project.members.map((member) => (
                  <option key={member.email} value={member.email}>
                    {member.email}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="actionType">
              What should happen?
            </label>
            <select
              style={styles.input}
              id="actionType"
              value={actionType}
              onChange={(e) => setActionType(e.target.value)}
            >
              <option value="MOVE_TASK">Move task to a status</option>
              <option value="ASSIGN_BADGE">Assign a badge</option>
              <option value="SEND_NOTIFICATION">Send a notification</option>
            </select>
          </div>

          {actionType === 'MOVE_TASK' && (
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="targetStatus">
                Move To Status
              </label>
              <select
                style={styles.input}
                id="targetStatus"
                value={targetStatus}
                onChange={(e) => setTargetStatus(e.target.value)}
              >
                {project.statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          )}

          {actionType === 'ASSIGN_BADGE' && (
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="badgeName">
                Badge Name
              </label>
              <input
                style={styles.input}
                type="text"
                id="badgeName"
                value={badgeName}
                onChange={(e) => setBadgeName(e.target.value)}
                placeholder="e.g., Task Master, Problem Solver"
              />
            </div>
          )}

          {actionType === 'SEND_NOTIFICATION' && (
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="notificationText">
                Notification Message
              </label>
              <textarea
                style={{ ...styles.input, ...styles.textarea }}
                id="notificationText"
                value={notificationText}
                onChange={(e) => setNotificationText(e.target.value)}
                placeholder="Enter notification message"
                rows={3}
              />
            </div>
          )}

          <div style={styles.actions}>
            <button
              type="button"
              style={styles.cancelButton}
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AutomationForm;