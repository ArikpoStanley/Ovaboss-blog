import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { PostService } from '../services/post.service'
import { useAuth } from '../hooks/useAuth'

const PostForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const isEditing = !!id
  
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [publishedAt, setPublishedAt] = useState('')
  const [errors, setErrors] = useState({})
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])
  
  // Fetch post data if editing
  const { data: postData, isLoading: isLoadingPost } = useQuery({
    queryKey: ['post', id],
    queryFn: () => PostService.getPost(id),
    enabled: isEditing, // Only run query if we're editing
  })
  
  // Populate form with post data when editing
  useEffect(() => {
    if (isEditing && postData?.data) {
      const post = postData.data
      setTitle(post.title)
      setContent(post.content)
      setImagePreview(post.image_path ? `${import.meta.env.VITE_API_URL}/storage/${post.image_path}` : '')
      setPublishedAt(post.published_at ? new Date(post.published_at).toISOString().split('T')[0] : '')
    }
  }, [isEditing, postData])
  
  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: (postData) => PostService.createPost(postData),
    onSuccess: (data) => {
      navigate(`/posts/${data.data.id}`)
    },
    onError: (error) => {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      } else {
        setErrors({ general: error.message || 'Failed to create post' })
      }
    }
  })
  
  // Update post mutation
  const updatePostMutation = useMutation({
    mutationFn: ({ id, data }) => PostService.updatePost(id, data),
    onSuccess: (data) => {
      navigate(`/posts/${data.data.id}`)
    },
    onError: (error) => {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      } else {
        setErrors({ general: error.message || 'Failed to update post' })
      }
    }
  })
  
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Form validation
    const newErrors = {}
    if (!title.trim()) newErrors.title = 'Title is required'
    if (!content.trim()) newErrors.content = 'Content is required'
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    const formData = {
      title,
      content,
      published_at: publishedAt || null,
    }
    
    if (image) {
      formData.image = image
    }
    
    if (isEditing) {
      updatePostMutation.mutate({ id, data: formData })
    } else {
      createPostMutation.mutate(formData)
    }
  }
  
  if (isEditing && isLoadingPost) {
    return (
      <>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading post data...</div>
        </div>
      </>
    )
  }
  
  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">
          {isEditing ? 'Edit Post' : 'Create New Post'}
        </h1>
        
        {errors.general && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
            {errors.general}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-3 py-2 border rounded ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter post title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="content">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={`w-full px-3 py-2 border rounded h-64 ${
                errors.content ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Write your post content here..."
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content}</p>
            )}
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="image">
              Image (Optional)
            </label>
            <input
              type="file"
              id="image"
              onChange={handleImageChange}
              className="w-full"
              accept="image/*"
            />
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">{errors.image}</p>
            )}
            
            {imagePreview && (
              <div className="mt-4">
                <p className="text-gray-700 mb-2">Image Preview:</p>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-full h-auto max-h-64 rounded"
                />
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="publishedAt">
              Publish Date (Optional)
            </label>
            <input
              type="date"
              id="publishedAt"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
              disabled={createPostMutation.isLoading || updatePostMutation.isLoading}
            >
              {createPostMutation.isLoading || updatePostMutation.isLoading
                ? 'Saving...'
                : isEditing
                ? 'Update Post'
                : 'Create Post'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default PostForm