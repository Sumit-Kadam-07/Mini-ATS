import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Candidate, CandidateStatus } from '../types/candidate'
import { CandidateCard } from './CandidateCard'

interface KanbanColumnProps {
  status: CandidateStatus
  title: string
  candidates: Candidate[]
  onDeleteCandidate: (id: string) => void
}

const statusConfig = {
  applied: {
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    iconColor: 'text-blue-500',
    hoverBorderColor: 'hover:border-blue-300'
  },
  interview: {
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-700',
    iconColor: 'text-yellow-500',
    hoverBorderColor: 'hover:border-yellow-300'
  },
  offer: {
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700',
    iconColor: 'text-green-500',
    hoverBorderColor: 'hover:border-green-300'
  },
  rejected: {
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-700',
    iconColor: 'text-red-500',
    hoverBorderColor: 'hover:border-red-300'
  }
}

export function KanbanColumn({ status, title, candidates, onDeleteCandidate }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  })

  const config = statusConfig[status]

  return (
    <div className="flex flex-col h-full">
      {/* Column Header */}
      <div className={`rounded-lg border-2 border-dashed p-4 mb-4 transition-all duration-200 ${
        config.bgColor
      } ${config.borderColor} ${
        isOver ? 'border-solid shadow-md scale-105' : config.hoverBorderColor
      }`}>
        <div className="flex items-center justify-between">
          <h3 className={`font-semibold ${config.textColor}`}>
            {title}
          </h3>
          <div className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
            config.bgColor === 'bg-blue-50' ? 'bg-blue-100' :
            config.bgColor === 'bg-yellow-50' ? 'bg-yellow-100' :
            config.bgColor === 'bg-green-50' ? 'bg-green-100' :
            'bg-red-100'
          } ${config.textColor}`}>
            {candidates.length}
          </div>
        </div>
      </div>

      {/* Drop Zone */}
      <div
        ref={setNodeRef}
        className={`flex-1 space-y-3 min-h-[500px] p-3 rounded-lg transition-all duration-200 ${
          isOver ? 'bg-gray-100 shadow-inner' : 'bg-gray-50'
        }`}
      >
        <SortableContext items={candidates.map(c => c.id)} strategy={verticalListSortingStrategy}>
          {candidates.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-lg">📋</span>
                </div>
                <p>No candidates yet</p>
                <p className="text-xs mt-1">Drag candidates here</p>
              </div>
            </div>
          ) : (
            candidates.map((candidate) => (
              <div key={candidate.id} className="animate-slide-up">
                <CandidateCard
                  candidate={candidate}
                  onDelete={onDeleteCandidate}
                />
              </div>
            ))
          )}
        </SortableContext>
      </div>
    </div>
  )
}