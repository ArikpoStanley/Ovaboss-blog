import Navbar from './Navbar';
import Footer from './Footer';
import { Toaster } from 'react-hot-toast';

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <Toaster position="top-right" />
    </div>
  );
};

export default MainLayout;