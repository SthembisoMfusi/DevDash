import React from 'react'
import { Box, Typography } from '@mui/material'
import { Folder } from 'lucide-react'
import EmptyState from '../components/EmptyState'

function ProjectDetail() {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Folder size={32} color="#6366F1" />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Project Detail
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Kanban board for project management
          </Typography>
        </Box>
      </Box>

      <EmptyState
        icon={Folder}
        title="Project page coming soon"
        description="The Kanban board view for managing project issues will be implemented here."
      />
    </Box>
  )
}

export default ProjectDetail
