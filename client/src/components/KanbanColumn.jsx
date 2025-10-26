import React from 'react'
import { Box, Typography, Paper } from '@mui/material'
import { useDroppable } from '@dnd-kit/core'

function KanbanColumn({ status, title, issues, onIssueClick, renderIssue }) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  })

  const getStatusColor = (status) => {
    const colors = {
      TODO: '#6B7280',
      IN_PROGRESS: '#3B82F6',
      IN_REVIEW: '#F59E0B',
      DONE: '#10B981',
    }
    return colors[status] || '#6B7280'
  }

  return (
    <Paper
      ref={setNodeRef}
      sx={{
        width: 280,
        minHeight: 500,
        bgcolor: isOver ? 'rgba(99, 102, 241, 0.05)' : '#1E1E1E',
        border: isOver
          ? '2px dashed rgba(99, 102, 241, 0.5)'
          : '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 2,
        p: 2,
        transition: 'all 0.2s',
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: getStatusColor(status),
            display: 'inline-block',
            mr: 1,
          }}
        />
        <Typography variant="h6" sx={{ fontWeight: 600, display: 'inline' }}>
          {title}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            ml: 1,
            color: 'text.secondary',
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            px: 1,
            py: 0.25,
            borderRadius: 1,
          }}
        >
          {issues.length}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {issues.map((issue) => (
          <Box key={issue.id} onClick={() => onIssueClick && onIssueClick(issue)}>
            {renderIssue ? renderIssue(issue) : null}
          </Box>
        ))}
      </Box>
    </Paper>
  )
}

export default KanbanColumn


