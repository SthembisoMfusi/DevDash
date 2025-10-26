import React from 'react'
import { Chip, Box } from '@mui/material'
import { ArrowDown, ArrowUp, AlertCircle, Circle } from 'lucide-react'

function PriorityIndicator({ priority, size = 'small', variant = 'chip' }) {
  const priorityConfig = {
    LOW: {
      label: 'Low',
      icon: <ArrowDown size={14} />,
      color: '#10B981',
      bgColor: 'rgba(16, 185, 129, 0.1)',
    },
    MEDIUM: {
      label: 'Medium',
      icon: <Circle size={14} />,
      color: '#F59E0B',
      bgColor: 'rgba(245, 158, 11, 0.1)',
    },
    HIGH: {
      label: 'High',
      icon: <ArrowUp size={14} />,
      color: '#EF4444',
      bgColor: 'rgba(239, 68, 68, 0.1)',
    },
    URGENT: {
      label: 'Urgent',
      icon: <AlertCircle size={14} />,
      color: '#DC2626',
      bgColor: 'rgba(220, 38, 38, 0.1)',
    },
  }

  const config = priorityConfig[priority] || priorityConfig.MEDIUM

  if (variant === 'dot') {
    return (
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          bgcolor: config.color,
        }}
      />
    )
  }

  return (
    <Chip
      icon={config.icon}
      label={config.label}
      size={size}
      sx={{
        bgcolor: config.bgColor,
        color: config.color,
        fontWeight: 600,
        fontSize: '0.75rem',
        height: size === 'small' ? 22 : 28,
        '& .MuiChip-icon': {
          color: config.color,
        },
      }}
    />
  )
}

export default PriorityIndicator

