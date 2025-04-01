import { useFormik } from 'formik';
import * as Yup from 'yup';

const CommentForm = ({ onSubmit, loading }) => {
  const formik = useFormik({
    initialValues: {
      content: '',
    },
    validationSchema: Yup.object({
      content: Yup.string()
        .max(500, 'Comment must be 500 characters or less')
        .required('Comment content is required'),
    }),
    onSubmit: (values, { resetForm }) => {
      onSubmit(values.content);
      resetForm();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="mb-6">
      <div className="mb-3">
        <label htmlFor="content" className="block text-gray-700 mb-2">Your Comment</label>
        <textarea
          id="content"
          rows="3"
          placeholder="Write your comment here..."
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
      
      <button
        type="submit"
        disabled={loading}
        className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
      >
        {loading ? 'Submitting...' : 'Submit Comment'}
      </button>
    </form>
  );
};

export default CommentForm;