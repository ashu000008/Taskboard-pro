import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserAssignedTasks } from '../../services/taskService';
import { format } from 'date-fns';
import './Dashboard.css';

function AssignedTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const data = await getUserAssignedTasks();
        setTasks(data);
        setError(null);
      } catch (err) {
        setError('Failed to load your tasks');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const formatDueDate = (dateString) => {
    if (!dateString) return 'No due date';
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  if (loading) {
    return <div className="loading-spinner">Loading your tasks...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="assigned-tasks">
      <div className="section-header">
        <h2>My Tasks</h2>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <p>You don't have any assigned tasks.</p>
        </div>
      ) : (
        <div className="tasks-table">
          <table>
            <thead>
              <tr>
                <th>Task</th>
                <th>Project</th>
                <th>Status</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task._id}>
                  <td>
                    <Link to={`/projects/${task.projectId._id}`} className="task-link">
                      {task.title}
                    </Link>
                  </td>
                  <td>{task.projectId.title}</td>
                  <td>
                    <span className={`status-badge ${task.status.replace(/\s+/g, '-').toLowerCase()}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className={`due-date ${task.dueDate && new Date(task.dueDate) < new Date() ? 'overdue' : ''}`}>
                    {formatDueDate(task.dueDate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AssignedTasks;
