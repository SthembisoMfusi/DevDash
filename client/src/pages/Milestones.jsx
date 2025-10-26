import React from 'react'
import { Box, Typography, Card, CardContent, Divider } from '@mui/material'
import { Flag } from 'lucide-react'
import EmptyState from '../components/EmptyState'

function Milestones() {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Flag size={32} color="#6366F1" />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Milestones
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track your project milestones and progress
          </Typography>
        </Box>
      </Box>

      <EmptyState
        icon={Flag}
        title="No milestones yet"
        description="Create milestones to track major project goals and deadlines."
        actionLabel="Create Milestone"
      />
    </Box>
  )
}

export default Milestones
