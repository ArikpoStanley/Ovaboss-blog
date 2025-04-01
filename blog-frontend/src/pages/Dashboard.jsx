import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]); // Store all fetched posts for frontend filtering
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const [authors, setAuthors] = useState([]);
  const [postsPerPage] = useState(10); // Adjust based on your desired items per page
  const { user } = useAuth();
  const currentUser = user;

  const fetchPosts = async () => {
    try {
      setLoading(true);
      let url = `/posts`;
      
      if (search) {
        url += `?search=${encodeURIComponent(search)}`;
      }

      console.log("Fetching URL:", url);
      
      const response = await axiosInstance.get(url);
      console.log("API Response:", response.data);
      
      if (response.data && response.data.data) {
        const fetchedPosts = response.data.data;
        setAllPosts(fetchedPosts); // Store all posts for frontend filtering
        
        // Extract unique authors
        const uniqueAuthors = [...new Set(fetchedPosts.map(post => post.user.name))];
        setAuthors(uniqueAuthors);
        
        // Handle pagination and filtering on the frontend
        applyFiltersAndPagination(fetchedPosts, authorFilter, currentPage);
        
        // Set last page based on filtered data
        const totalFilteredItems = authorFilter 
          ? fetchedPosts.filter(post => post.user.name === authorFilter).length 
          : fetchedPosts.length;
          
        const calculatedLastPage = Math.ceil(totalFilteredItems / postsPerPage);
        setLastPage(calculatedLastPage || 1);
      } else {
        console.error("Unexpected API response structure:", response.data);
        setError('Unexpected API response structure');
      }
    } catch (err) {
      setError('Failed to load posts. Please try again later.');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndPagination = (postsToFilter, authorName, page) => {
    let filteredPosts = postsToFilter;
    if (authorName) {
      filteredPosts = postsToFilter.filter(post => post.user.name === authorName);
    }
    
    // Calculate pagination
    const startIndex = (page - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    
    // Apply pagination to the filtered posts
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
    
    // Update state with the filtered and paginated posts
    setPosts(paginatedPosts);
  };

  useEffect(() => {
    fetchPosts();
  }, [search]); // Only refetch from API when search changes

  useEffect(() => {
    if (allPosts.length > 0) {
      applyFiltersAndPagination(allPosts, authorFilter, currentPage);
      
      // Recalculate last page based on filtered data
      const totalFilteredItems = authorFilter 
        ? allPosts.filter(post => post.user.name === authorFilter).length 
        : allPosts.length;
        
      const calculatedLastPage = Math.ceil(totalFilteredItems / postsPerPage);
      setLastPage(calculatedLastPage || 1);
    }
  }, [currentPage, authorFilter, allPosts]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleAuthorFilterChange = (e) => {
    setAuthorFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleNextPage = () => {
    if (currentPage < lastPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setAuthorFilter('');
    setCurrentPage(1);
  };

  const handleDeletePost = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axiosInstance.delete(`/posts/${id}`);
        // Remove the deleted post from allPosts
        const updatedAllPosts = allPosts.filter(post => post.id !== id);
        setAllPosts(updatedAllPosts);
        
        // Re-apply filtering and pagination
        applyFiltersAndPagination(updatedAllPosts, authorFilter, currentPage);
        
        // If we deleted the last post on the page, go to the previous page
        if (posts.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (err) {
        setError('Failed to delete post. Please try again later.');
        console.error('Error deleting post:', err);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Dashboard</h1>
          <Link
            to="/create-post"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300"
          >
            Create New Post
          </Link>
        </div>

        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1 md:col-span-2">
              <input
                type="text"
                placeholder="Search by title..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={search}
                onChange={handleSearchChange}
              />
            </div>
            <div>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={authorFilter}
                onChange={handleAuthorFilterChange}
              >
                <option value="">All Authors</option>
                {authors.map((author, index) => (
                  <option key={index} value={author}>
                    {author}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Filter indicator and clear button */}
          {(search || authorFilter) && (
            <div className="mt-2 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Filters applied: 
                {search && <span className="ml-1 font-medium">Search: "{search}"</span>}
                {search && authorFilter && <span className="mx-1">and</span>}
                {authorFilter && <span className="font-medium">Author: {authorFilter}</span>}
              </div>
              <button 
                onClick={handleClearFilters}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading posts...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Comments
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {posts.length > 0 ? (
                    posts.map((post) => (
                      <tr key={post.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            to={`/posts/${post.id}`}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {post.title}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {post.user.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(post.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {post.comments_count || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {currentUser && currentUser.id === post.user.id && (
                            <div className="flex space-x-2">
                              <Link
                                to={`/edit-post/${post.id}`}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                Edit
                              </Link>
                              <button
                                onClick={() => handleDeletePost(post.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                        No posts found. Try adjusting your search or filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {lastPage > 0 && (
              <div className="mt-6 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Showing page {currentPage} of {lastPage}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage <= 1}
                    className={`px-4 py-2 border rounded-md ${
                      currentPage <= 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage >= lastPage}
                    className={`px-4 py-2 border rounded-md ${
                      currentPage >= lastPage
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;