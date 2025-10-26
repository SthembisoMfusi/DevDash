import React from 'react'
import { Box, Typography } from '@mui/material'
import { FileText } from 'lucide-react'
import EmptyState from '../components/EmptyState'

function IssueDetail() {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <FileText size={32} color="#6366F1" />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Issue Detail
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Git Information Block and issue management
          </Typography>
        </Box>
      </Box>

      <EmptyState
        icon={FileText}
        title="Issue detail coming soon"
        description="The issue detail page with Git Information Block will be implemented here."
      />
    </Box>
  )
}

export default IssueDetail
