import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Ova-blog</Link>
        
        <div className="flex space-x-4">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
              <Link to="/create-post" className="hover:text-gray-300">Create Post</Link>
              <Link to="/profile" className="hover:text-gray-300">Profile ({user?.name})</Link>
              <button onClick={logout} className="hover:text-gray-300">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300">Login</Link>
              <Link to="/register" className="hover:text-gray-300">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;