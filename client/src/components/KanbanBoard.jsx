import React, { useState } from 'react'
import { Box } from '@mui/material'
import {
  DndContext,
  DragOverlay,
  closestCorners,
} from '@dnd-kit/core'
import KanbanColumn from './KanbanColumn'
import IssueCard from './IssueCard'
import toast from 'react-hot-toast'

function KanbanBoard({ issues = [], onStatusChange }) {
  const [activeIssue, setActiveIssue] = useState(null)

  const columns = [
    { status: 'TODO', title: 'To Do' },
    { status: 'IN_PROGRESS', title: 'In Progress' },
    { status: 'IN_REVIEW', title: 'In Review' },
    { status: 'DONE', title: 'Done' },
  ]

  const getIssuesByStatus = (status) => issues.filter((issue) => issue.status === status)

  const handleDragStart = (event) => {
    setActiveIssue(event.active.data.current)
  }

  const handleDragEnd = async (event) => {
    const { active, over } = event

    if (!over) {
      setActiveIssue(null)
      return
    }

    const issue = active.data.current
    const newStatus = over.id

    // Don't update if status hasn't changed
    if (issue.status === newStatus) {
      setActiveIssue(null)
      return
    }

    try {
      if (onStatusChange) {
        await onStatusChange(issue.id, newStatus)
        toast.success('Issue moved successfully')
      }
    } catch (error) {
      console.error('Error updating issue status:', error)
      toast.error('Failed to update issue status')
    } finally {
      setActiveIssue(null)
    }
  }

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          pb: 2,
          '&::-webkit-scrollbar': {
            height: 8,
          },
          '&::-webkit-scrollbar-track': {
            background: '#151515',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#2A2A2A',
            borderRadius: 4,
          },
        }}
      >
        {columns.map((column) => (
          <KanbanColumn
            key={column.status}
            status={column.status}
            title={column.title}
            issues={getIssuesByStatus(column.status)}
            renderIssue={(issue) => <IssueCard issue={issue} />}
          />
        ))}
      </Box>

      <DragOverlay>
        {activeIssue ? <IssueCard issue={activeIssue} /> : null}
      </DragOverlay>
    </DndContext>
  )
}

export default KanbanBoard


