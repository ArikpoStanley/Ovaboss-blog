
import {  Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import useAuth from './context/useAuth'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import PostForm from './pages/PostForm'
import PostDetails from './pages/PostDetails'
import NotFound from './pages/NotFound'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import PostsPage from './pages/Posts'
import Dashboard from './pages/Dashboard'
import Cookies from 'js-cookie';
const USER_COOKIE_NAME = 'XSRF-TOKEN';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  // Add loading state for a better UX
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }
  
  // Check both user in context and cookie directly
  const userCookie = Cookies.get(USER_COOKIE_NAME);

  console.log(user, userCookie)
  
  // Either auth context or cookie should allow access
  if (!user && !userCookie) {
    return <Navigate to="/login" />
  }
  
  return children
}

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
    <main className="flex-grow container mx-auto px-4 py-8">
    <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/posts/:id" element={<PostDetails />} />
      <Route path="/posts" element={<PostsPage />} />
     
      {/* Protected routes */}
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />

<Route path="/dashboard"
element={
  <ProtectedRoute>
   <Dashboard />
  </ProtectedRoute>
} 
 />
      <Route 
        path="/create-post" 
        element={
          <ProtectedRoute>
            <PostForm />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/edit-post/:id" 
        element={
          <ProtectedRoute>
            <PostForm />
          </ProtectedRoute>
        } 
      />
      
      {/* 404 page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
    </Suspense>
    </main>
    <Footer />
    </div>
  )
}

export default App