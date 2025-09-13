import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Plus, User, Briefcase, Calendar, Link } from 'lucide-react'
import { CandidateFormData } from '../types/candidate'

const candidateSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  role: z.string()
    .min(2, 'Role must be at least 2 characters')
    .max(100, 'Role must be less than 100 characters'),
  experience: z.number()
    .min(0, 'Experience cannot be negative')
    .max(50, 'Experience cannot exceed 50 years'),
  resume_link: z.string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
  status: z.enum(['applied', 'interview', 'offer', 'rejected']),
})

interface CandidateFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CandidateFormData) => Promise<void>
  loading?: boolean
}

export function CandidateForm({ isOpen, onClose, onSubmit, loading = false }: CandidateFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<CandidateFormData>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      status: 'applied',
      experience: 0,
      resume_link: '',
    },
  })

  const watchedValues = watch()

  const handleFormSubmit = async (data: CandidateFormData) => {
    try {
      await onSubmit({
        ...data,
        experience: Number(data.experience),
        resume_link: data.resume_link || undefined,
      })
      reset()
      onClose()
    } catch (error) {
      console.error('Failed to create candidate:', error)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Add New Candidate</h2>
              <p className="text-sm text-gray-500">Fill in the candidate details</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            disabled={isSubmitting || loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Candidate Name *
            </label>
            <input
              {...register('name')}
              type="text"
              className={`input-field ${errors.name ? 'border-red-300 focus:ring-red-500' : ''}`}
              placeholder="e.g., John Doe"
              disabled={isSubmitting || loading}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <span className="w-4 h-4 mr-1">⚠️</span>
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Role Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Briefcase className="w-4 h-4 inline mr-2" />
              Role *
            </label>
            <input
              {...register('role')}
              type="text"
              className={`input-field ${errors.role ? 'border-red-300 focus:ring-red-500' : ''}`}
              placeholder="e.g., Frontend Developer"
              disabled={isSubmitting || loading}
            />
            {errors.role && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <span className="w-4 h-4 mr-1">⚠️</span>
                {errors.role.message}
              </p>
            )}
          </div>

          {/* Experience Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Years of Experience *
            </label>
            <input
              {...register('experience', { valueAsNumber: true })}
              type="number"
              min="0"
              max="50"
              className={`input-field ${errors.experience ? 'border-red-300 focus:ring-red-500' : ''}`}
              placeholder="e.g., 3"
              disabled={isSubmitting || loading}
            />
            {errors.experience && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <span className="w-4 h-4 mr-1">⚠️</span>
                {errors.experience.message}
              </p>
            )}
          </div>

          {/* Resume Link Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Link className="w-4 h-4 inline mr-2" />
              Resume Link (Optional)
            </label>
            <input
              {...register('resume_link')}
              type="url"
              className={`input-field ${errors.resume_link ? 'border-red-300 focus:ring-red-500' : ''}`}
              placeholder="https://example.com/resume.pdf"
              disabled={isSubmitting || loading}
            />
            {errors.resume_link && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <span className="w-4 h-4 mr-1">⚠️</span>
                {errors.resume_link.message}
              </p>
            )}
          </div>

          {/* Status Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Initial Status *
            </label>
            <select
              {...register('status')}
              className="input-field"
              disabled={isSubmitting || loading}
            >
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Preview */}
          {watchedValues.name && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
              <div className="text-sm text-gray-600">
                <p><strong>{watchedValues.name}</strong> - {watchedValues.role}</p>
                <p>{watchedValues.experience} years experience</p>
                <p>Status: {watchedValues.status}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="btn-secondary"
              disabled={isSubmitting || loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting || loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add Candidate</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}