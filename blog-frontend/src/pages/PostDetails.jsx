// src/pages/PostDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PostService} from '../services/post.service';
import CommentService from '../services/comment.service';
import { useAuth } from '../hooks/useAuth';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentError, setCommentError] = useState(null);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await PostService.getPost(`${id}`);
        setPost(response?.data);
        setComments(response?.data?.comments);
      } catch (err) {
        setError('Failed to fetch post');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentError(null);

    if (!commentText.trim()) {
      setCommentError('Comment cannot be empty');
      return;
    }

    try {
      console.log(commentText)
      const response = await CommentService.addComment(`${id}`, commentText);
      
      // Add the new comment to the list
      setComments([...comments, response.data.comment]);
      setCommentText('');
    } catch (err) {
      setCommentError('Failed to post comment');
      console.error(err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await CommentService.deleteComment(`/comments/${commentId}`);
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (err) {
      setCommentError('Failed to delete comment');
      console.error(err);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await PostService.deletePost(`/posts/${id}`);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to delete post');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error || !post) {
    return <div className="text-center mt-10 text-red-500">{error || 'Post not found'}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link to="/" className="text-blue-500 hover:underline">&larr; Back to Posts</Link>
      </div>

      <article className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{post?.title}</h1>
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-500">
            By {post?.user?.name} • {new Date(post.created_at).toLocaleDateString()}
          </p>
          
          {user && user.id === post.user_id && (
            <div className="flex space-x-2">
              <Link 
                to={`/posts/edit/${post.id}`} 
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </Link>
              <button
                onClick={handleDeletePost}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {post.image_path && (
          <div className="mb-4">
            <img 
              // src={`${process.env.REACT_APP_BACKEND_URL}/storage/${post.image_path}`}
              alt={post.title}
              className="max-w-full h-auto rounded"
            />
          </div>
        )}

        <div className="prose max-w-none">
          {post?.content?.split("\n").map((paragraph, idx) => (
            <p key={idx} className="mb-4">{paragraph}</p>
          ))}
        </div>
      </article>

      <div className="border-t pt-6 mt-6">
        <h2 className="text-2xl font-bold mb-4">Comments ({comments?.length})</h2>
        
        {isAuthenticated ? (
          <form onSubmit={handleCommentSubmit} className="mb-6">
            <div className="mb-2">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Leave a comment..."
                className="w-full p-2 border rounded"
                rows="3"
              ></textarea>
              {commentError && <p className="text-red-500 mt-1">{commentError}</p>}
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Post Comment
            </button>
          </form>
        ) : (
          <div className="bg-gray-100 p-4 rounded mb-6">
            <p>Please <Link to="/login" className="text-blue-500">login</Link> to leave a comment.</p>
          </div>
        )}
        
        {comments?.length === 0 ? (
          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
        ) : (
          <div className="space-y-4">
            {comments?.map(comment => (
              <div key={comment?.id} className="border-b pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{comment?.user?.name}</p>
                    <p className="text-gray-500 text-sm">
                      {new Date(comment?.created_at).toLocaleString()}
                    </p>
                  </div>
                  
                  {user && user.id === comment?.user_id && (
                    <button
                      onClick={() => handleDeleteComment(comment?.id)}
                      className="text-red-500 text-sm hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className="mt-2">{comment?.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetail;

// import { useParams, useNavigate } from 'react-router-dom';
// import { format } from 'date-fns';
// import { usePost, useAddComment, useDeleteComment, useDeletePost } from '../hooks/usePosts';
// import CommentForm from '../components/blog/CommentForm';
// import CommentList from '../components/blog/CommentList';
// import LoadingSpinner from '../components/common/LoadingSpinner';
// import MainLayout from '../components/layout/MainLayout';
// import useAuth from '../hooks/useAuth';
// import toast from 'react-hot-toast';

// const PostDetailPage = () => {
//   const { id } = useParams();
//   const { data: post, isLoading } = usePost(id);
//   const addComment = useAddComment();
//   const deleteComment = useDeleteComment();
//   const deletePost = useDeletePost();
//   const { currentUser, isAuthenticated } = useAuth();
//   const navigate = useNavigate();
  
//   const handleCommentSubmit = async (content) => {
//     try {
//       await addComment.mutateAsync({ postId: id, content });
//       toast.success('Comment added successfully');
//     } catch (error) {
//       console.log(error)
//       toast.error('Failed to add comment');
//     }
//   };
  
//   const handleCommentDelete = async (commentId) => {
//     if (window.confirm('Are you sure you want to delete this comment?')) {
//       try {
//         await deleteComment.mutateAsync({ commentId, postId: id });
//         toast.success('Comment deleted successfully');
//       } catch (error) {
//         console.log(error)
//         toast.error('Failed to delete comment');
//       }
//     }
//   };
  
//   const handlePostDelete = async () => {
//     if (window.confirm('Are you sure you want to delete this post?')) {
//       try {
//         await deletePost.mutateAsync(id);
//         toast.success('Post deleted successfully');
//         navigate('/posts');
//       } catch (error) {
//         console.log(error)
//         toast.error('Failed to delete post');
//       }
//     }
//   };

//   return (
//     <MainLayout>
//       <div className="py-6">
//         {isLoading ? (
//           <LoadingSpinner />
//         ) : (
//           <>
//             <article className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
//               {post.image_url && (
//                 <img 
//                   src={post.image_url} 
//                   alt={post.title} 
//                   className="w-full h-80 object-cover"
//                 />
//               )}
              
//               <div className="p-8">
//                 <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
                
//                 <div className="flex items-center text-gray-500 mb-6">
//                   <span>By {post.user?.name || 'Unknown'}</span>
//                   <span className="mx-2">•</span>
//                   <span>
//                     {post.published_at 
//                       ? format(new Date(post.published_at), 'MMM d, yyyy') 
//                       : 'Draft'}
//                   </span>
//                 </div>
                
//                 <div className="prose max-w-none">
//                   {post.content.split('\n').map((paragraph, i) => (
//                     <p key={i} className="mb-4">{paragraph}</p>
//                   ))}
//                 </div>
                
//                 {currentUser?.id === post.user_id && (
//                   <div className="mt-8 flex space-x-4">
//                     <button
//                       onClick={() => navigate(`/posts/${id}/edit`)}
//                       className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
//                     >
//                       Edit Post
//                     </button>
                    
//                     <button
//                       onClick={handlePostDelete}
//                       className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
//                     >
//                       Delete Post
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </article>
            
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h2 className="text-xl font-bold mb-6">Comments</h2>
              
//               {isAuthenticated ? (
//                 <CommentForm 
//                   onSubmit={handleCommentSubmit} 
//                   loading={addComment.isLoading}
//                 />
//               ) : (
//                 <div className="bg-gray-100 p-4 mb-6 rounded-md text-center">
//                   Please <a href="/login" className="text-indigo-600 hover:underline">log in</a> to leave a comment.
//                 </div>
//               )}
              
//               <CommentList 
//                 comments={post.comments} 
//                 onDelete={handleCommentDelete}
//               />
//             </div>
//           </>
//         )}
//       </div>
//     </MainLayout>
//   );
// };

// export default PostDetailPage;