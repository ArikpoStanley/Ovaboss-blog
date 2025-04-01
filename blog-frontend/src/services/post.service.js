import axiosInstance from '../utils/axiosConfig';

export const PostService = {
  // Get all posts with pagination
  getPosts: async ( page = 1, search = '', author = '') => {
    try {
      const response = await axiosInstance.get('/posts', {
        params: { page, search, author }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get a single post by ID
  getPost: async (id) => {
    try {
      const response = await axiosInstance.get(`/posts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create a new post
  createPost: async (postData) => {
    try {
      // If post contains an image, we need to use FormData
      if (postData.image) {
        const formData = new FormData();
        formData.append('title', postData.title);
        formData.append('content', postData.content);
        formData.append('image', postData.image);
        
        if (postData.published_at) {
          formData.append('published_at', postData.published_at);
        }
        
        const response = await axiosInstance.post('/posts/create', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } else {
        const response = await axiosInstance.post('/posts/create', postData);
        return response.data;
      }
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update a post
  updatePost: async (id, postData) => {
    try {
      // If post contains an image, we need to use FormData
      if (postData.image instanceof File) {
        const formData = new FormData();
        formData.append('title', postData.title);
        formData.append('content', postData.content);
        formData.append('image', postData.image);
        
        if (postData.published_at) {
          formData.append('published_at', postData.published_at);
        }
        
        // Use PUT method for updating
        formData.append('_method', 'PUT');
        
        const response = await axiosInstance.post(`/posts/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } else {
        const response = await axiosInstance.put(`/posts/${id}`, postData);
        return response.data;
      }
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a post
  deletePost: async (id) => {
    try {
      const response = await axiosInstance.delete(`/posts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
