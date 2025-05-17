import { useState } from 'react';
import { createComment } from '../../services/commentService';
import './Comments.css';

function CommentForm({ taskId, onCommentAdded }) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      const newComment = await createComment({
        taskId,
        content: content.trim()
      });
      
      setContent('');
      onCommentAdded(newComment);
    } catch (err) {
      setError('Failed to post comment');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      {error && <div className="comment-error">{error}</div>}
      
      <textarea
        className="comment-input"
        placeholder="Add a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isSubmitting}
      />
      
      <div className="comment-form-actions">
        <button 
          type="submit" 
          className="post-comment-btn"
          disabled={!content.trim() || isSubmitting}
        >
          {isSubmitting ? 'Posting...' : 'Post'}
        </button>
      </div>
    </form>
  );
}

export default CommentForm;
