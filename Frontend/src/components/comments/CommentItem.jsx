import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { deleteComment } from '../../services/commentService';
import './Comments.css';

function CommentItem({ comment, currentUserId, onDeleted, projectId }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  
  const isAuthor = comment.author.userId === currentUserId;
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        setIsDeleting(true);
        await deleteComment(comment._id);
        onDeleted(comment._id);
      } catch (err) {
        setError('Failed to delete comment');
        console.error(err);
        setIsDeleting(false);
      }
    }
  };
  
  const formatDate = (date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };
  
  return (
    <div className={`comment-item ${isDeleting ? 'deleting' : ''}`}>
      {error && <div className="comment-error">{error}</div>}
      
      <div className="comment-header">
        <div className="comment-author">
          {comment.author.photoURL ? (
            <img 
              src={comment.author.photoURL} 
              alt={comment.author.name}
              className="author-avatar"
            />
          ) : (
            <div className="author-initial">
              {comment.author.name.charAt(0)}
            </div>
          )}
          <div className="author-info">
            <span className="author-name">{comment.author.name}</span>
            <span className="comment-date">{formatDate(comment.createdAt)}</span>
          </div>
        </div>
        
        {isAuthor && (
          <button 
            className="delete-comment-btn"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <span className="delete-icon">×</span>
          </button>
        )}
      </div>
      
      <div className="comment-content">
        {comment.content}
      </div>
    </div>
  );
}

export default CommentItem;
