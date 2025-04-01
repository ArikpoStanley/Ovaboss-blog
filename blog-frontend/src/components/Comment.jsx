import React, { useState } from 'react';
import { CommentService } from '../services/comment.service';
import AuthService from '../services/auth.service';

const CommentSection = ({ postId, comments, onCommentAdded }) => {
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const currentUser = AuthService.getCurrentUser();
  const isAuthenticated = AuthService.isAuthenticated();

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
    if (error) setError(null);
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    
    if (newComment.length > 500) {
      setError('Comment must be less than 500 characters');
      return;
    }
    
    setLoading(true);
    try {
      const response = await CommentService.addComment(postId, newComment);
      setNewComment('');
      if (onCommentAdded) {
        onCommentAdded(response.data);
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to post comment. Please try again.');
      setLoading(false);
      console.error('Error posting comment:', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await CommentService.deleteComment(commentId);
        if (onCommentAdded) {
          // This will refresh the comments list
          onCommentAdded(null);
        }
      } catch (err) {
        console.error('Error deleting comment:', err);
        alert('Failed to delete comment. Please try again.');
      }
    }
  };

  return (
    <div className="mt-8 border-t border-gray-200 pt-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Comments ({comments?.length || 0})
      </h2>
      
      {isAuthenticated ? (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="mb-2">
            <textarea
              value={newComment}
              onChange={handleCommentChange}
              placeholder="Add a comment..."
              rows="3"
              className={`w-full px-4 py-2 border ${
                error ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            ></textarea>
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            <p className="mt-1 text-sm text-gray-500">
              Maximum 500 characters ({newComment.length}/500)
            </p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 rounded-md">
          <p className="text-gray-700">
            Please <a href="/login" className="text-blue-600 hover:underline">login</a> to add a comment.
          </p>
        </div>
      )}
      
      <div className="space-y-4">
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between">
                <div className="font-medium text-gray-800">{comment.user.name}</div>
                <div className="text-sm text-gray-500">
                  {new Date(comment.created_at).toLocaleString()}
                </div>
              </div>
              <p className="mt-2 text-gray-700">{comment.content}</p>
              
              {currentUser && currentUser.id === comment.user.id && (
                <div className="mt-2 text-right">
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;