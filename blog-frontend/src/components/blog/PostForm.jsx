import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const PostForm = ({ initialValues, onSubmit, loading }) => {
  const [preview, setPreview] = useState(null);
  
  const formik = useFormik({
    initialValues: {
      title: initialValues?.title || '',
      content: initialValues?.content || '',
      image: null,
      published_at: initialValues?.published_at ? new Date(initialValues.published_at).toISOString().split('T')[0] : '',
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .max(255, 'Title must be 255 characters or less')
        .required('Title is required'),
      content: Yup.string()
        .required('Content is required'),
      image: Yup.mixed(),
      published_at: Yup.date().nullable(),
    }),
    onSubmit: (values) => {
      onSubmit(values);
    },
  });
  
  // Set image preview when file is selected
  useEffect(() => {
    if (formik.values.image && formik.values.image instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(formik.values.image);
    } else {
      setPreview(initialValues?.image_url || null);
    }
  }, [formik.values.image, initialValues?.image_url]);

  // Handle file input change
  const handleFileChange = (event) => {
    formik.setFieldValue('image', event.currentTarget.files[0]);
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-gray-700 mb-2">Title</label>
        <input
          id="title"
          type="text"
          placeholder="Post title"
          {...formik.getFieldProps('title')}
          className={`w-full px-3 py-2 border rounded-md ${
            formik.touched.title && formik.errors.title
              ? 'border-red-500'
              : 'border-gray-300'
          }`}
        />
        {formik.touched.title && formik.errors.title && (
          <p className="mt-1 text-red-500 text-sm">{formik.errors.title}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="content" className="block text-gray-700 mb-2">Content</label>
        <textarea
          id="content"
          rows="8"
          placeholder="Write your post content here..."
          {...formik.getFieldProps('content')}
          className={`w-full px-3 py-2 border rounded-md ${
            formik.touched.content && formik.errors.content
              ? 'border-red-500'
              : 'border-gray-300'
          }`}
        ></textarea>
        {formik.touched.content && formik.errors.content && (
          <p className="mt-1 text-red-500 text-sm">{formik.errors.content}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="image" className="block text-gray-700 mb-2">Featured Image (Optional)</label>
        <input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        {preview && (
          <div className="mt-2">
            <img src={preview} alt="Preview" className="h-40 object-cover rounded-md" />
          </div>
        )}
      </div>
      
      <div>
        <label htmlFor="published_at" className="block text-gray-700 mb-2">Publish Date (Optional)</label>
        <input
          id="published_at"
          type="date"
          {...formik.getFieldProps('published_at')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        <p className="text-gray-600 text-sm mt-1">Leave empty to save as draft</p>
      </div>
      
      <div>
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
        >
          {loading ? 'Saving...' : (initialValues ? 'Update Post' : 'Create Post')}
        </button>
      </div>
    </form>
  );
};

export default PostForm;