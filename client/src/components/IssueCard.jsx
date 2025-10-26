import React from 'react'
import { Card, CardContent, Box, Typography, Avatar } from '@mui/material'
import { MessageSquare } from 'lucide-react'
import { useDraggable } from '@dnd-kit/core'
import StatusBadge from './StatusBadge'
import PriorityIndicator from './PriorityIndicator'
import UserAvatar from './UserAvatar'

function IssueCard({ issue, onClick }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: issue.id,
    data: issue,
  })

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  }

  return (
    <Card
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      onClick={onClick}
      sx={{
        cursor: isDragging ? 'grabbing' : 'grab',
        mb: 2,
        bgcolor: '#1E1E1E',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'all 0.2s',
        '&:hover': {
          borderColor: 'rgba(99, 102, 241, 0.5)',
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.1)',
        },
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            mb: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {issue.title}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <StatusBadge status={issue.status} />
          <PriorityIndicator priority={issue.priority} />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {issue.assignee ? (
            <UserAvatar user={issue.assignee} size={24} />
          ) : (
            <Avatar sx={{ width: 24, height: 24, bgcolor: 'rgba(255, 255, 255, 0.05)' }}>
              ?
            </Avatar>
          )}

          {issue._count?.comments > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <MessageSquare size={14} color="#9CA3AF" />
              <Typography variant="caption" color="text.secondary">
                {issue._count.comments}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default IssueCard

