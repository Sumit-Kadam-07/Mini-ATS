import React, { useState, useMemo } from 'react'
import { Layout } from './components/Layout'
import { KanbanBoard } from './components/KanbanBoard'
import { CandidateForm } from './components/CandidateForm'
import { SearchFilter } from './components/SearchFilter'
import { AnalyticsDashboard } from './components/AnalyticsDashboard'
import { useCandidates } from './hooks/useCandidates'
import { useAnalytics } from './hooks/useAnalytics'
import { CandidateStatus } from './types/candidate'

function App() {
  const [currentView, setCurrentView] = useState<'kanban' | 'analytics'>('kanban')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const { 
    candidates, 
    loading: candidatesLoading, 
    error: candidatesError,
    createCandidate, 
    updateCandidateStatus, 
    deleteCandidate,
    refetch: refetchCandidates
  } = useCandidates()

  const { 
    analytics, 
    loading: analyticsLoading, 
    error: analyticsError,
    refetch: refetchAnalytics
  } = useAnalytics()

  // Filter candidates based on search and filter criteria
  const filteredCandidates = useMemo(() => {
    return candidates.filter(candidate => {
      const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          candidate.role.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRole = !roleFilter || candidate.role === roleFilter
      const matchesStatus = !statusFilter || candidate.status === statusFilter
      
      return matchesSearch && matchesRole && matchesStatus
    })
  }, [candidates, searchTerm, roleFilter, statusFilter])

  // Get unique roles for filter dropdown
  const uniqueRoles = useMemo(() => {
    return Array.from(new Set(candidates.map(c => c.role))).sort()
  }, [candidates])

  const handleRefresh = async () => {
    await Promise.all([refetchCandidates(), refetchAnalytics()])
  }

  const handleCandidateUpdate = async (id: string, status: CandidateStatus) => {
    try {
      await updateCandidateStatus(id, status)
      // Refresh analytics when candidate status changes
      refetchAnalytics()
    } catch (error) {
      console.error('Failed to update candidate:', error)
    }
  }

  const handleCandidateCreate = async (data: any) => {
    try {
      await createCandidate(data)
      // Refresh analytics when new candidate is added
      refetchAnalytics()
    } catch (error) {
      console.error('Failed to create candidate:', error)
    }
  }

  const handleCandidateDelete = async (id: string) => {
    try {
      await deleteCandidate(id)
      // Refresh analytics when candidate is deleted
      refetchAnalytics()
    } catch (error) {
      console.error('Failed to delete candidate:', error)
    }
  }

  // Error state
  if (candidatesError || analyticsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-6">
            Unable to connect to the database. Please make sure Supabase is properly configured.
          </p>
          <div className="space-y-3">
            <button
              onClick={handleRefresh}
              className="btn-primary w-full"
            >
              Retry Connection
            </button>
            <div className="text-sm text-gray-500">
              <p>Make sure you have:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Created a Supabase project</li>
                <li>Added your credentials to .env</li>
                <li>Run the database migration</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Layout
        currentView={currentView}
        onViewChange={setCurrentView}
        onAddCandidate={() => setIsFormOpen(true)}
        onRefresh={handleRefresh}
        loading={candidatesLoading || analyticsLoading}
      >
        {currentView === 'kanban' ? (
          <div className="space-y-6">
            <SearchFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              roleFilter={roleFilter}
              onRoleFilterChange={setRoleFilter}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              roles={uniqueRoles}
            />

            {candidatesLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading candidates...</p>
                </div>
              </div>
            ) : (
              <KanbanBoard
                candidates={filteredCandidates}
                onUpdateStatus={handleCandidateUpdate}
                onDeleteCandidate={handleCandidateDelete}
              />
            )}
          </div>
        ) : (
          <div>
            {analyticsLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading analytics...</p>
                </div>
              </div>
            ) : analytics ? (
              <AnalyticsDashboard analytics={analytics} />
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Analytics Data</h3>
                <p className="text-gray-500">Add some candidates to see analytics</p>
              </div>
            )}
          </div>
        )}
      </Layout>

      <CandidateForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCandidateCreate}
        loading={candidatesLoading}
      />
    </>
  )
}

export default App