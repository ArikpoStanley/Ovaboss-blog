import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import useAuth from '../../context/useAuth';

const PostCard = ({ post, onDelete }) => {
  const { currentUser } = useAuth();
  const isOwner = currentUser?.id === post.user_id;
  
  // Function to truncate text
  const truncate = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {post.image_url && (
        <img 
          src={post.image_url} 
          alt={post.title} 
          className="w-full h-48 object-cover"
        />
      )}
      
      <div className="p-6">
        <h2 className="text-xl font-bold mb-2">
          <Link to={`/posts/${post.id}`} className="text-indigo-600 hover:text-indigo-800">
            {post.title}
          </Link>
        </h2>
        
        <div className="text-gray-500 text-sm mb-4">
          By {post.user?.name || 'Unknown'} • 
          {post.published_at 
            ? format(new Date(post.published_at), ' MMM d, yyyy') 
            : ' Draft'}
        </div>
        
        <div className="mb-4 text-gray-700">
          {truncate(post.content)}
        </div>
        
        <div className="flex justify-between items-center">
          <Link 
            to={`/posts/${post.id}`} 
            className="text-indigo-600 hover:underline"
          >
            Read more
          </Link>
          
          {isOwner && (
            <div className="flex space-x-2">
              <Link 
                to={`/posts/${post.id}/edit`}
                className="text-blue-600 hover:underline"
              >
                Edit
              </Link>
              <button
                onClick={() => onDelete(post.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;