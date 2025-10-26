import React from 'react'
import { Box, Typography, Button } from '@mui/material'

function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 3,
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          bgcolor: 'rgba(99, 102, 241, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
        }}
      >
        {Icon && <Icon size={40} color="#6366F1" />}
      </Box>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary', maxWidth: 400 }}>
        {description}
      </Typography>
      {onAction && actionLabel && (
        <Button variant="contained" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Box>
  )
}

export default EmptyState

