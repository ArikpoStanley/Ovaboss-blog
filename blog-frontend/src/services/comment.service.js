import axiosInstance from '../utils/axiosConfig';

const CommentService = {
  // Add a comment to a post
  addComment: async (postId, content) => {
    try {
      console.log(content)
      const response = await axiosInstance.post(`/posts/${postId}/comments`, { content });
      console.log(response)
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a comment
  deleteComment: async (commentId) => {
    try {
      const response = await axiosInstance.delete(`/comments/${commentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default CommentService;