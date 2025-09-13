import { supabase } from './supabase'
import { Candidate, CandidateFormData, CandidateStatus, Analytics } from '../types/candidate'

export class DatabaseService {
  /**
   * Fetch all candidates from the database
   */
  static async getCandidates(): Promise<Candidate[]> {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching candidates:', error)
        throw new Error(`Failed to fetch candidates: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error('Database error in getCandidates:', error)
      throw error
    }
  }

  /**
   * Create a new candidate
   */
  static async createCandidate(candidateData: CandidateFormData): Promise<Candidate> {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .insert([{
          ...candidateData,
          resume_link: candidateData.resume_link || null
        }])
        .select()
        .single()

      if (error) {
        console.error('Error creating candidate:', error)
        throw new Error(`Failed to create candidate: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Database error in createCandidate:', error)
      throw error
    }
  }

  /**
   * Update candidate status
   */
  static async updateCandidateStatus(id: string, status: CandidateStatus): Promise<Candidate> {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating candidate status:', error)
        throw new Error(`Failed to update candidate: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Database error in updateCandidateStatus:', error)
      throw error
    }
  }

  /**
   * Delete a candidate
   */
  static async deleteCandidate(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('candidates')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting candidate:', error)
        throw new Error(`Failed to delete candidate: ${error.message}`)
      }
    } catch (error) {
      console.error('Database error in deleteCandidate:', error)
      throw error
    }
  }

  /**
   * Get analytics data
   */
  static async getAnalytics(): Promise<Analytics> {
    try {
      const candidates = await this.getCandidates()
      
      const totalCandidates = candidates.length
      const statusCounts = {
        applied: 0,
        interview: 0,
        offer: 0,
        rejected: 0
      }

      const roleCounts: Record<string, number> = {}
      let totalExperience = 0

      // Process candidates data
      candidates.forEach(candidate => {
        statusCounts[candidate.status]++
        roleCounts[candidate.role] = (roleCounts[candidate.role] || 0) + 1
        totalExperience += candidate.experience
      })

      // Create status breakdown
      const statusBreakdown = Object.entries(statusCounts).map(([status, count]) => ({
        status: status as CandidateStatus,
        count,
        percentage: totalCandidates > 0 ? Math.round((count / totalCandidates) * 100) : 0
      }))

      // Create role breakdown
      const roleBreakdown = Object.entries(roleCounts)
        .map(([role, count]) => ({ role, count }))
        .sort((a, b) => b.count - a.count) // Sort by count descending

      const averageExperience = totalCandidates > 0 
        ? Math.round((totalExperience / totalCandidates) * 10) / 10 // Round to 1 decimal
        : 0

      return {
        totalCandidates,
        statusBreakdown,
        roleBreakdown,
        averageExperience
      }
    } catch (error) {
      console.error('Database error in getAnalytics:', error)
      throw error
    }
  }
}