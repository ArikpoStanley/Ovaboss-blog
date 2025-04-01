// src/pages/EditPost.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    published_at: '',
  });
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/posts/${id}`);
        const post = response.data;
        
        // Check if current user is the post owner
        if (post.user_id !== user.id) {
          navigate('/dashboard');
          return;
        }
        
        setFormData({
          title: post.title,
          content: post.content,
          published_at: post.published_at ? new Date(post.published_at).toISOString().slice(0, 16) : '',
        });
        
        if (post.image_path) {
          setCurrentImage(post.image_path);
        }
        
        setLoading(false);
      } catch (err) {
        setErrors({ general: 'Failed to fetch post' });
        console.error(err);
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user.id, navigate]);

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
    
    setSubmitting(true);
    
    // Create FormData object for file upload
    const postData = new FormData();
    postData.append('_method', 'PUT'); // Laravel method spoofing for PUT requests
    postData.append('title', formData.title);
    postData.append('content', formData.content);
    
    if (formData.published_at) {
      postData.append('published_at', formData.published_at);
    }
    
    if (image) {
      postData.append('image', image);
    }
    
    try {
      const response = await axios.post(`/posts/${id}`, postData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      navigate(`/posts/${response.data.post.id}`);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: error.response?.data?.message || 'Failed to update post' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
      
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
          
          {currentImage && (
            <div className="mb-2">
              <img 
                // eslint-disable-next-line no-undef
                src={`${process.env.REACT_APP_BACKEND_URL}/storage/${currentImage}`}
                alt="Current featured image"
                className="max-w-xs h-auto rounded"
              />
              <p className="text-sm text-gray-500 mt-1">Current image</p>
            </div>
          )}
          
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border rounded"
          />
          <p className="text-gray-500 text-sm mt-1">
            Upload a new image to replace the current one
          </p>
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
            disabled={submitting}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Save Changes'}
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

export default EditPost;