import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const SearchFilter = ({ onSearch }) => {
  const location = useLocation()
  const navigate = useNavigate()
  
  // Get current search params from URL
  const searchParams = new URLSearchParams(location.search)
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [authorFilter, setAuthorFilter] = useState(searchParams.get('author') || '')

  const handleSearch = (e) => {
    e.preventDefault()
    
    // Update URL with search params
    const params = new URLSearchParams()
    if (searchTerm) params.set('search', searchTerm)
    if (authorFilter) params.set('author', authorFilter)
    
    navigate(`${location.pathname}?${params.toString()}`)
    
    // Call onSearch callback with search parameters
    onSearch({
      search: searchTerm,
      author: authorFilter
    })
  }

  const handleReset = () => {
    setSearchTerm('')
    setAuthorFilter('')
    navigate(location.pathname)
    onSearch({})
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by title..."
            className="form-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <input
            type="text"
            placeholder="Filter by author..."
            className="form-input"
            value={authorFilter}
            onChange={(e) => setAuthorFilter(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button 
            type="submit" 
            className="btn btn-primary flex-shrink-0"
          >
            Search
          </button>
          <button 
            type="button" 
            className="btn btn-secondary flex-shrink-0"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  )
}

export default SearchFilter