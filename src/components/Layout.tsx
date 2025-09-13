import React from 'react'
import { Users, BarChart3, Plus, RefreshCw, Github, ExternalLink } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
  currentView: 'kanban' | 'analytics'
  onViewChange: (view: 'kanban' | 'analytics') => void
  onAddCandidate: () => void
  onRefresh: () => void
  loading?: boolean
}

export function Layout({ 
  children, 
  currentView, 
  onViewChange, 
  onAddCandidate, 
  onRefresh, 
  loading = false 
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Mini ATS</h1>
                  <p className="text-xs text-gray-500">Applicant Tracking System</p>
                </div>
              </div>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-1">
                <button
                  onClick={() => onViewChange('kanban')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                    currentView === 'kanban'
                      ? 'bg-primary-100 text-primary-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Candidates</span>
                </button>
                <button
                  onClick={() => onViewChange('analytics')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                    currentView === 'analytics'
                      ? 'bg-primary-100 text-primary-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Analytics</span>
                </button>
              </nav>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={onRefresh}
                disabled={loading}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 disabled:opacity-50"
                title="Refresh data"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              
              {currentView === 'kanban' && (
                <button
                  onClick={onAddCandidate}
                  className="btn-primary flex items-center space-x-2 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Candidate</span>
                  <span className="sm:hidden">Add</span>
                </button>
              )}

              <a
                href="https://github.com/yourusername/mini-ats"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
                title="View on GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-2">
          <button
            onClick={() => onViewChange('kanban')}
            className={`px-4 py-3 text-center transition-all duration-200 ${
              currentView === 'kanban'
                ? 'bg-primary-50 text-primary-700 border-t-2 border-primary-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users className="w-5 h-5 mx-auto mb-1" />
            <span className="text-xs font-medium">Candidates</span>
          </button>
          <button
            onClick={() => onViewChange('analytics')}
            className={`px-4 py-3 text-center transition-all duration-200 ${
              currentView === 'analytics'
                ? 'bg-primary-50 text-primary-700 border-t-2 border-primary-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <BarChart3 className="w-5 h-5 mx-auto mb-1" />
            <span className="text-xs font-medium">Analytics</span>
          </button>
        </div>
      </div>

      {/* Bottom padding for mobile navigation */}
      <div className="md:hidden h-16"></div>
    </div>
  )
}