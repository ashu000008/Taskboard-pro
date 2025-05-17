import { useAuth } from '../../context/AuthContext';
import { removeUserFromProject } from '../../services/projectService';
import './Projects.css';

function MembersList({ members, projectId, onMemberRemoved, isOwner }) {
  const { currentUser } = useAuth();
  
  const handleRemoveMember = async (member) => {
    if (!isOwner) {
      return; // Only owners can remove members
    }
    
    // Cannot remove yourself as an owner
    if (member.email === currentUser.email) {
      alert('Cannot remove yourself as project owner');
      return;
    }
    
    if (window.confirm(`Are you sure you want to remove ${member.email} from this project?`)) {
      try {
        // Use either userId or email to identify the member
        const memberIdentifier = member.userId || member.email;
        await removeUserFromProject(projectId, memberIdentifier);
        onMemberRemoved();
      } catch (err) {
        console.error('Failed to remove member:', err);
        alert('Failed to remove member. Please try again.');
      }
    }
  };
  
  return (
    <div className="members-list">
      {members.map(member => (
        <div key={member.email} className="member-item">
          <div className="member-info">
            <span className="member-email">{member.email}</span>
            <span className={`member-role ${member.role}`}>{member.role}</span>
            {member.userId === null && <span className="pending-tag">Pending</span>}
          </div>
          {isOwner && member.email !== currentUser?.email && (
            <button 
              className="remove-member-btn" 
              onClick={() => handleRemoveMember(member)}
            >
              Remove
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default MembersList;
