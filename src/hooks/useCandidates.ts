import { useState, useEffect, useCallback } from 'react'
import { Candidate, CandidateFormData, CandidateStatus } from '../types/candidate'
import { DatabaseService } from '../lib/database'

interface UseCandidatesReturn {
  candidates: Candidate[]
  loading: boolean
  error: string | null
  createCandidate: (data: CandidateFormData) => Promise<Candidate>
  updateCandidateStatus: (id: string, status: CandidateStatus) => Promise<Candidate>
  deleteCandidate: (id: string) => Promise<void>
  refetch: () => Promise<void>
}

export function useCandidates(): UseCandidatesReturn {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCandidates = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await DatabaseService.getCandidates()
      setCandidates(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch candidates'
      setError(errorMessage)
      console.error('Error fetching candidates:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const createCandidate = useCallback(async (candidateData: CandidateFormData): Promise<Candidate> => {
    try {
      const newCandidate = await DatabaseService.createCandidate(candidateData)
      setCandidates(prev => [newCandidate, ...prev])
      return newCandidate
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create candidate'
      setError(errorMessage)
      throw err
    }
  }, [])

  const updateCandidateStatus = useCallback(async (id: string, status: CandidateStatus): Promise<Candidate> => {
    try {
      const updatedCandidate = await DatabaseService.updateCandidateStatus(id, status)
      setCandidates(prev => prev.map(c => c.id === id ? updatedCandidate : c))
      return updatedCandidate
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update candidate'
      setError(errorMessage)
      throw err
    }
  }, [])

  const deleteCandidate = useCallback(async (id: string): Promise<void> => {
    try {
      await DatabaseService.deleteCandidate(id)
      setCandidates(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete candidate'
      setError(errorMessage)
      throw err
    }
  }, [])

  useEffect(() => {
    fetchCandidates()
  }, [fetchCandidates])

  return {
    candidates,
    loading,
    error,
    createCandidate,
    updateCandidateStatus,
    deleteCandidate,
    refetch: fetchCandidates
  }
}