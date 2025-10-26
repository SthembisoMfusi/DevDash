import React from 'react'
import { Chip } from '@mui/material'
import { Check, Clock, Eye, Circle } from 'lucide-react'

function StatusBadge({ status, size = 'small' }) {
  const statusConfig = {
    TODO: {
      label: 'To Do',
      color: 'default',
      icon: <Circle size={14} />,
      bgColor: 'rgba(156, 163, 175, 0.1)',
      textColor: '#9CA3AF',
    },
    IN_PROGRESS: {
      label: 'In Progress',
      color: 'primary',
      icon: <Clock size={14} />,
      bgColor: 'rgba(59, 130, 246, 0.1)',
      textColor: '#3B82F6',
    },
    IN_REVIEW: {
      label: 'In Review',
      color: 'warning',
      icon: <Eye size={14} />,
      bgColor: 'rgba(245, 158, 11, 0.1)',
      textColor: '#F59E0B',
    },
    DONE: {
      label: 'Done',
      color: 'success',
      icon: <Check size={14} />,
      bgColor: 'rgba(16, 185, 129, 0.1)',
      textColor: '#10B981',
    },
  }

  const config = statusConfig[status] || statusConfig.TODO

  return (
    <Chip
      icon={config.icon}
      label={config.label}
      size={size}
      sx={{
        bgcolor: config.bgColor,
        color: config.textColor,
        fontWeight: 600,
        fontSize: '0.75rem',
        height: size === 'small' ? 22 : 28,
        '& .MuiChip-icon': {
          color: config.textColor,
        },
      }}
    />
  )
}

export default StatusBadge

