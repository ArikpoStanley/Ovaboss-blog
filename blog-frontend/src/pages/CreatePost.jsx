import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    published_at: '',
  });
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    // Create FormData object for file upload
    const postData = new FormData();
    postData.append('title', formData.title);
    postData.append('content', formData.content);
    
    if (formData.published_at) {
      postData.append('published_at', formData.published_at);
    }
    
    if (image) {
      postData.append('image', image);
    }
    
    try {
      const response = await axios.post('/posts', postData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      navigate(`/posts/${response.data.post.id}`);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: error.response?.data?.message || 'Failed to create post' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
      
      {errors.general && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errors.general}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            maxLength={255}
          />
          {errors.title && <p className="text-red-500 mt-1">{errors.title}</p>}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="10"
          ></textarea>
          {errors.content && <p className="text-red-500 mt-1">{errors.content}</p>}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Featured Image (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border rounded"
          />
          {errors.image && <p className="text-red-500 mt-1">{errors.image}</p>}
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">
            Publish Date (optional)
          </label>
          <input
            type="datetime-local"
            name="published_at"
            value={formData.published_at}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <p className="text-gray-500 text-sm mt-1">
            Leave empty to publish immediately
          </p>
          {errors.published_at && (
            <p className="text-red-500 mt-1">{errors.published_at}</p>
          )}
        </div>
        
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Post'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;

// import { useNavigate } from 'react-router-dom';
// import { useCreatePost } from '../context/usePosts';
// import PostForm from '../components/blog/PostForm';
// import MainLayout from '../components/layout/MainLayout';
// import ProtectedRoute from '../components/layout/ProtectedRoute';
// import toast from 'react-hot-toast';

// const CreatePostPage = () => {
//   const createPost = useCreatePost();
//   const navigate = useNavigate();
  
//   const handleSubmit = async (values) => {
//     try {
//       const result = await createPost.mutateAsync(values);
//       toast.success('Post created successfully');
//       navigate(`/posts/${result.id}`);
//     } catch (error) {
//         console.log(error)
//       toast.error('Failed to create post');
//     }
//   };

//   return (
//     <ProtectedRoute>
//       <MainLayout>
//         <div className="py-6">
//           <h1 className="text-3xl font-bold mb-8 text-gray-800">Create New Post</h1>
          
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <PostForm 
//               onSubmit={handleSubmit}
//               loading={createPost.isLoading}
//             />
//           </div>
//         </div>
//       </MainLayout>
//     </ProtectedRoute>
//   );
// };

// export default CreatePostPage;