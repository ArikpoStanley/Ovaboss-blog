import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const RegisterForm = () => {
  const { register, loading } = useAuth();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required('Name is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
      password_confirmation: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
    }),
    onSubmit: async (values) => {
      try {
        await register(values);
      } catch (error) {
        // Error is handled in the AuthContext
        console.error('Registration error:', error);
      }
    },
  });

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
      
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
        
        <div className="mb-4">
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
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Your password"
              {...formik.getFieldProps('password')}
              className={`w-full px-3 py-2 border rounded-md ${
                formik.touched.password && formik.errors.password
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="mt-1 text-red-500 text-sm">{formik.errors.password}</p>
            )}
          </div>
          
          <div className="mb-6">
            <label htmlFor="password_confirmation" className="block text-gray-700 mb-2">Confirm Password</label>
            <input
              id="password_confirmation"
              type="password"
              placeholder="Confirm your password"
              {...formik.getFieldProps('password_confirmation')}
              className={`w-full px-3 py-2 border rounded-md ${
                formik.touched.password_confirmation && formik.errors.password_confirmation
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            />
            {formik.touched.password_confirmation && formik.errors.password_confirmation && (
              <p className="mt-1 text-red-500 text-sm">{formik.errors.password_confirmation}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    );
  };
  
  export default RegisterForm;