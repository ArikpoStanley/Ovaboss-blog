// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [authors, setAuthors] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState('');

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await axiosInstance.get('/posts');
        // Extract unique authors from posts
        const uniqueAuthors = [...new Set(response.data.data.map(post => post.user.id))];
        const authorList = uniqueAuthors.map(id => {
          const author = response.data.data.find(post => post.user.id === id).user;
          return { id: author.id, name: author.name };
        });
        setAuthors(authorList);
      } catch (err) {
        console.error('Error fetching authors:', err);
      }
    };

    fetchAuthors();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        let url = `/posts?page=${currentPage}`;
        if (searchQuery) {
          url += `&search=${searchQuery}`;
        }
        if (selectedAuthor) {
          url += `&author=${selectedAuthor}`;
        }

        const response = await axiosInstance.get(url);
        setPosts(response.data.data);
        setLastPage(response.data.last_page);
      } catch (err) {
        setError('Failed to fetch posts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage, searchQuery, selectedAuthor]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(search);
    setCurrentPage(1);
  };

  const handleAuthorChange = (e) => {
    setSelectedAuthor(e.target.value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearch('');
    setSearchQuery('');
    setSelectedAuthor('');
    setCurrentPage(1);
  };

  if (loading && posts.length === 0) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Latest Blog Posts</h1>

      <div className="mb-6 flex flex-wrap gap-4">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="flex">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title..."
              className="flex-1 p-2 border rounded-l"
            />
            <button
              type="submit"
              className="bg-indigo-600 cursor-pointer text-white px-4 py-2 rounded-r"
            >
              Search
            </button>
          </div>
        </form>

        <div className="flex-1">
          <select
            value={selectedAuthor}
            onChange={handleAuthorChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Filter by author</option>
            {authors.map(author => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>
        </div>

        {(searchQuery || selectedAuthor) && (
          <button
            onClick={handleClearFilters}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
          >
            Clear filters
          </button>
        )}
      </div>

      {posts.length === 0 ? (
        <div className="text-center mt-10">No posts found</div>
      ) : (
        <div className="space-y-6">
          {posts.map(post => (
            <div key={post.id} className="border rounded-lg p-4 shadow-sm">
              <Link to={`/posts/${post.id}`}>
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              </Link>
              <p className="text-gray-500 mb-2">
                By {post.user.name} • {new Date(post.created_at).toLocaleDateString()}
              </p>
              <p className="mb-2">
                {post.content.length > 200 
                  ? post.content.substring(0, 200) + '...' 
                  : post.content}
              </p>
              <div className="flex justify-between">
                <Link 
                  to={`/posts/${post.id}`} 
                  className="text-indigo-600 hover:underline"
                >
                  Read more
                </Link>
                <span className="text-gray-500">{post.comments_count} comments</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {lastPage > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {currentPage} of {lastPage}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, lastPage))}
            disabled={currentPage === lastPage}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;