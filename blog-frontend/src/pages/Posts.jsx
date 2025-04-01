import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { PostService } from '../services/post.service'
import PostCard from '../components/blog/PostCard'

const Posts = () => {
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  // eslint-disable-next-line no-unused-vars
  const [authorId, setAuthorId] = useState('')
  const [searchInput, setSearchInput] = useState('')

  // Fetch posts with pagination, search, and author filtering
  const { data, isLoading, error } = useQuery({
    queryKey: ['posts', page, search, authorId],
    queryFn: () => PostService.getPosts(page, search, authorId),
    keepPreviousData: true
  })

  const posts = data?.data?.data || []
  const totalPages = data?.data?.last_page || 1

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1) // Reset to first page on new search
  }

  const handleClearSearch = () => {
    setSearchInput('')
    setSearch('')
    setPage(1)
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Blog Posts</h1>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search posts by title..."
              className="flex-grow p-2 border rounded"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Search
            </button>
            {search && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Clear
              </button>
            )}
          </div>
        </form>

        {isLoading ? (
          <div className="text-center py-8">Loading posts...</div>
        ) : error ? (
          <div className="text-red-600 text-center py-8">
            Error loading posts: {error.message}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8">
            No posts found{search ? ` matching "${search}"` : ''}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {posts.length > 0 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setPage((old) => Math.max(old - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 mr-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((old) => (old < totalPages ? old + 1 : old))}
              disabled={page === totalPages}
              className="px-4 py-2 ml-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default Posts