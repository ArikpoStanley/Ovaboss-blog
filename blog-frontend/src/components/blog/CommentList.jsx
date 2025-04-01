import { format } from 'date-fns';
import useAuth from '../../context/useAuth';

const CommentList = ({ comments, onDelete }) => {
  const { currentUser } = useAuth();
  
  if (!comments || comments.length === 0) {
    return (
      <div className="text-gray-500 italic text-center py-4">
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="bg-gray-50 p-4 rounded-md">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">{comment.user?.name || 'Unknown user'}</h4>
              <p className="text-gray-500 text-sm">
                {format(new Date(comment.created_at), 'MMM d, yyyy • h:mm a')}
              </p>
            </div>
            {currentUser?.id === comment.user_id && (
              <button
                onClick={() => onDelete(comment.id)}
                className="text-red-600 hover:underline text-sm"
              >
                Delete
              </button>
            )}
          </div>
          <p className="mt-2 text-gray-700">{comment.content}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;