import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await login(formData);
      navigate('/dashboard');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: error.response?.data?.message || 'Login failed' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">Login</h2>
      
      {errors.general && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errors.general}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {errors.email && <p className="text-red-500 mt-1">{errors.email}</p>}
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {errors.password && <p className="text-red-500 mt-1">{errors.password}</p>}
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;

// import { useFormik } from 'formik';
// import * as Yup from 'yup';
// import useAuth from '../../hooks/useAuth';
// import { Link } from 'react-router-dom';

// const LoginForm = () => {
//   const { login, loading } = useAuth();

//   const formik = useFormik({
//     initialValues: {
//       email: '',
//       password: '',
//     },
//     validationSchema: Yup.object({
//       email: Yup.string()
//         .email('Invalid email address')
//         .required('Email is required'),
//       password: Yup.string()
//         .required('Password is required'),
//     }),
//     onSubmit: async (values) => {
//       try {
//         await login(values);
//       } catch (error) {
//         // Error is handled in the AuthContext
//         console.error('Login error:', error);
//       }
//     },
//   });

//   return (
//     <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      
//       <form onSubmit={formik.handleSubmit}>
//         <div className="mb-4">
//           <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
//           <input
//             id="email"
//             type="email"
//             placeholder="Your email"
//             {...formik.getFieldProps('email')}
//             className={`w-full px-3 py-2 border rounded-md ${
//               formik.touched.email && formik.errors.email
//                 ? 'border-red-500'
//                 : 'border-gray-300'
//             }`}
//           />
//           {formik.touched.email && formik.errors.email && (
//             <p className="mt-1 text-red-500 text-sm">{formik.errors.email}</p>
//           )}
//         </div>
        
//         <div className="mb-6">
//           <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
//           <input
//             id="password"
//             type="password"
//             placeholder="Your password"
//             {...formik.getFieldProps('password')}
//             className={`w-full px-3 py-2 border rounded-md ${
//               formik.touched.password && formik.errors.password
//                 ? 'border-red-500'
//                 : 'border-gray-300'
//             }`}
//           />
//           {formik.touched.password && formik.errors.password && (
//             <p className="mt-1 text-red-500 text-sm">{formik.errors.password}</p>
//           )}
//         </div>
        
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
//         >
//           {loading ? 'Logging in...' : 'Login'}
//         </button>
//       </form>
      
//       <p className="mt-4 text-center text-gray-600">
//         Don't have an account?{' '}
//         <Link to="/register" className="text-indigo-600 hover:underline">
//           Register
//         </Link>
//       </p>
//     </div>
//   );
// };

// export default LoginForm;