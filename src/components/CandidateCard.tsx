import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { User, Calendar, Briefcase, ExternalLink, Trash2, GripVertical } from 'lucide-react'
import { Candidate } from '../types/candidate'
import { formatDistanceToNow } from 'date-fns'

interface CandidateCardProps {
  candidate: Candidate
  onDelete: (id: string) => void
}

export function CandidateCard({ candidate, onDelete }: CandidateCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: candidate.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm(`Are you sure you want to delete ${candidate.name}?`)) {
      onDelete(candidate.id)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200 group ${
        isDragging ? 'opacity-50 shadow-lg scale-105 rotate-2' : ''
      }`}
    >
      {/* Header with drag handle */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3 flex-1">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{candidate.name}</h3>
            <p className="text-sm text-gray-600 truncate">{candidate.role}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            {...attributes}
            {...listeners}
            className="p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            title="Drag to move"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-200"
            title="Delete candidate"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
          <span>{candidate.experience} year{candidate.experience !== 1 ? 's' : ''} experience</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
          <span>Added {formatDistanceToNow(new Date(candidate.created_at))} ago</span>
        </div>

        {candidate.resume_link && (
          <a
            href={candidate.resume_link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center text-sm text-primary-600 hover:text-primary-700 transition-colors duration-200 group/link"
          >
            <ExternalLink className="w-4 h-4 mr-2 group-hover/link:scale-110 transition-transform duration-200" />
            <span>View Resume</span>
          </a>
        )}
      </div>

      {/* Status indicator */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          candidate.status === 'applied' ? 'bg-blue-100 text-blue-700' :
          candidate.status === 'interview' ? 'bg-yellow-100 text-yellow-700' :
          candidate.status === 'offer' ? 'bg-green-100 text-green-700' :
          'bg-red-100 text-red-700'
        }`}>
          {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
        </div>
      </div>
    </div>
  )
}