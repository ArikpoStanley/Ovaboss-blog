import { useFormik } from 'formik';
import * as Yup from 'yup';
import useAuth from '../../hooks/useAuth';

const ProfileForm = () => {
  const { currentUser, updateProfile, loading } = useAuth();

  const formik = useFormik({
    initialValues: {
      name: currentUser?.name || '',
      email: currentUser?.email || '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string()
        .required('Name is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    }),
    onSubmit: async (values) => {
      try {
        await updateProfile(values);
      } catch (error) {
        console.error('Profile update error:', error);
      }
    },
  });

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Update Profile</h2>
      
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 mb-2">Name</label>
          <input
            id="name"
            type="text"
            placeholder="Your name"
            {...formik.getFieldProps('name')}
            className={`w-full px-3 py-2 border rounded-md ${
              formik.touched.name && formik.errors.name
                ? 'border-red-500'
                : 'border-gray-300'
            }`}
          />
          {formik.touched.name && formik.errors.name && (
            <p className="mt-1 text-red-500 text-sm">{formik.errors.name}</p>
          )}
        </div>
        
        <div className="mb-6">
          <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Your email"
            {...formik.getFieldProps('email')}
            className={`w-full px-3 py-2 border rounded-md ${
              formik.touched.email && formik.errors.email
                ? 'border-red-500'
                : 'border-gray-300'
            }`}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="mt-1 text-red-500 text-sm">{formik.errors.email}</p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;