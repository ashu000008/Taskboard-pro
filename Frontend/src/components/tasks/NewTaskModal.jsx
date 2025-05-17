import { useState } from 'react';
import { createTask } from '../../services/taskService';

function NewTaskModal({ project, onClose, onTaskCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(project.statuses[0]);
  const [assignee, setAssignee] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    try {
      setIsSubmitting(true);
      await createTask({
        title,
        description,
        projectId: project._id,
        status,
        assignee,
        dueDate: dueDate || undefined,
      });
      onTaskCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
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
      maxWidth: '500px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      animation: 'fadeIn 0.3s ease',
      padding: '20px',
      overflow: 'hidden', // Prevent content overflow
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
      whiteSpace: 'nowrap', // Prevent title from wrapping
      overflow: 'hidden', // Hide overflowing text
      textOverflow: 'ellipsis', // Add ellipsis for long titles
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
    inputFocus: {
      borderColor: '#2563eb',
      boxShadow: '0 0 4px rgba(37, 99, 235, 0.5)',
      outline: 'none',
      backgroundColor: '#ffffff',
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
    cancelButtonHover: {
      backgroundColor: '#e2e8f0',
      color: '#1e293b',
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
    submitButtonDisabled: {
      backgroundColor: '#93c5fd',
      cursor: 'not-allowed',
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
          <h2 style={styles.title}>Create New Task</h2>
          <button style={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div style={styles.errorMessage}>{error}</div>}

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="title">
              Task Title *
            </label>
            <input
              style={styles.input}
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="description">
              Description
            </label>
            <textarea
              style={{ ...styles.input, ...styles.textarea }}
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              rows={4}
            ></textarea>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="status">
                Status
              </label>
              <select
                style={styles.input}
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {project.statuses.map((statusOption) => (
                  <option key={statusOption} value={statusOption}>
                    {statusOption}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="dueDate">
                Due Date
              </label>
              <input
                style={styles.input}
                type="date"
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="assignee">
              Assignee (Email)
            </label>
            <select
              style={styles.input}
              id="assignee"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
            >
              <option value="">Unassigned</option>
              {project.members.map((member) => (
                <option key={member.email} value={member.email}>
                  {member.email}
                </option>
              ))}
            </select>
          </div>

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
              style={{
                ...styles.submitButton,
                ...(isSubmitting ? styles.submitButtonDisabled : {}),
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewTaskModal;