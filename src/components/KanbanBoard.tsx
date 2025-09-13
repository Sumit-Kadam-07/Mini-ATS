import React, { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import { Candidate, CandidateStatus } from '../types/candidate'
import { KanbanColumn } from './KanbanColumn'
import { CandidateCard } from './CandidateCard'

interface KanbanBoardProps {
  candidates: Candidate[]
  onUpdateStatus: (id: string, status: CandidateStatus) => Promise<void>
  onDeleteCandidate: (id: string) => void
}

const columns = [
  { status: 'applied' as CandidateStatus, title: 'Applied' },
  { status: 'interview' as CandidateStatus, title: 'Interview' },
  { status: 'offer' as CandidateStatus, title: 'Offer' },
  { status: 'rejected' as CandidateStatus, title: 'Rejected' },
]

export function KanbanBoard({ candidates, onUpdateStatus, onDeleteCandidate }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeCandidate = candidates.find(c => c.id === activeId)
    if (!activeCandidate) return

    // Check if we're dropping over a column
    if (columns.some(col => col.status === overId)) {
      const newStatus = overId as CandidateStatus
      if (activeCandidate.status !== newStatus && !isUpdating) {
        setIsUpdating(true)
        onUpdateStatus(activeId, newStatus)
          .catch(error => {
            console.error('Failed to update candidate status:', error)
          })
          .finally(() => {
            setIsUpdating(false)
          })
      }
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null)
  }

  const getCandidatesByStatus = (status: CandidateStatus) => {
    return candidates.filter(candidate => candidate.status === status)
  }

  const activeCandidate = activeId ? candidates.find(c => c.id === activeId) : null

  return (
    <div className="h-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
          {columns.map((column) => (
            <div key={column.status} className="animate-slide-up">
              <KanbanColumn
                status={column.status}
                title={column.title}
                candidates={getCandidatesByStatus(column.status)}
                onDeleteCandidate={onDeleteCandidate}
              />
            </div>
          ))}
        </div>

        <DragOverlay>
          {activeCandidate ? (
            <div className="rotate-6 scale-105">
              <CandidateCard 
                candidate={activeCandidate} 
                onDelete={() => {}} 
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Loading overlay */}
      {isUpdating && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 shadow-lg flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
            <span className="text-sm font-medium text-gray-700">Updating candidate...</span>
          </div>
        </div>
      )}
    </div>
  )
}