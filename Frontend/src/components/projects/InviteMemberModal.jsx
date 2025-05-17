import { useState } from 'react';
import { inviteUserToProject } from '../../services/projectService';

function InviteMemberModal({ projectId, onClose, onMemberInvited }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setIsSubmitting(true);
      await inviteUserToProject(projectId, email);
      onMemberInvited();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to invite user');
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
      maxWidth: '400px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      padding: '20px',
      animation: 'fadeIn 0.3s ease',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
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
      width: '100%', // Ensure the input box takes full width of the modal
      padding: '10px 12px',
      border: '1px solid #cbd5e1',
      borderRadius: '6px',
      fontSize: '1rem',
      backgroundColor: '#f9fafb',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      boxSizing: 'border-box', // Prevent padding from affecting width
    },
    inputFocus: {
      borderColor: '#2563eb',
      boxShadow: '0 0 4px rgba(37, 99, 235, 0.5)',
      outline: 'none',
      backgroundColor: '#ffffff',
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
    submitButtonDisabled: {
      backgroundColor: '#93c5fd',
      cursor: 'not-allowed',
    },
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>Invite Member</h2>
          <button style={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div style={styles.errorMessage}>{error}</div>}

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="email">
              Email Address *
            </label>
            <input
              style={styles.input}
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              required
            />
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
              {isSubmitting ? 'Sending Invite...' : 'Send Invite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InviteMemberModal;