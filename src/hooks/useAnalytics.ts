import { useState, useEffect, useCallback } from 'react'
import { Analytics } from '../types/candidate'
import { DatabaseService } from '../lib/database'

interface UseAnalyticsReturn {
  analytics: Analytics | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useAnalytics(): UseAnalyticsReturn {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await DatabaseService.getAnalytics()
      setAnalytics(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch analytics'
      setError(errorMessage)
      console.error('Error fetching analytics:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics
  }
}