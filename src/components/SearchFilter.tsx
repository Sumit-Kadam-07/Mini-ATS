import React from 'react'
import { Search, Filter, X } from 'lucide-react'

interface SearchFilterProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  roleFilter: string
  onRoleFilterChange: (role: string) => void
  statusFilter: string
  onStatusFilterChange: (status: string) => void
  roles: string[]
}

export function SearchFilter({
  searchTerm,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  statusFilter,
  onStatusFilterChange,
  roles,
}: SearchFilterProps) {
  const clearAllFilters = () => {
    onSearchChange('')
    onRoleFilterChange('')
    onStatusFilterChange('')
  }

  const hasActiveFilters = searchTerm || roleFilter || statusFilter

  return (
    <div className="card animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">Search & Filter</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1 transition-colors duration-200"
          >
            <X className="w-4 h-4" />
            <span>Clear all</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name or role..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input-field pl-10 pr-10"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Role Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            value={roleFilter}
            onChange={(e) => onRoleFilterChange(e.target.value)}
            className="input-field pl-10 pr-8 appearance-none bg-white cursor-pointer"
          >
            <option value="">All Roles ({roles.length})</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="input-field pl-10 pr-8 appearance-none bg-white cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                Search: "{searchTerm}"
                <button
                  onClick={() => onSearchChange('')}
                  className="ml-2 hover:text-primary-900 transition-colors duration-200"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {roleFilter && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                Role: {roleFilter}
                <button
                  onClick={() => onRoleFilterChange('')}
                  className="ml-2 hover:text-green-900 transition-colors duration-200"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {statusFilter && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                Status: {statusFilter}
                <button
                  onClick={() => onStatusFilterChange('')}
                  className="ml-2 hover:text-yellow-900 transition-colors duration-200"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}