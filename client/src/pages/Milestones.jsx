import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material'
import { Flag, Plus, Edit, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

function Milestones() {
  const [milestones, setMilestones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchMilestones()
  }, [])

  const fetchMilestones = async () => {
    try {
      const response = await fetch('http://localhost:3000/milestones', {
        credentials: 'include',
      })

      if (response.ok) {
        const milestonesData = await response.json()
        setMilestones(milestonesData)
      } else {
        setError('Failed to load milestones')
      }
    } catch (error) {
      console.error('Error fetching milestones:', error)
      setError('Failed to load milestones')
    } finally {
      setLoading(false)
    }
  }

  const calculateProgress = (milestone) => {
    const totalIssues = milestone._count?.issues || 0
    if (totalIssues === 0) return 0

    const completedIssues =
      milestone.issues?.filter((issue) => issue.status === 'DONE').length || 0
    return Math.round((completedIssues / totalIssues) * 100)
  }

  const getDaysUntilDue = (dueDate) => {
    if (!dueDate) return null
    const days = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24))
    return days
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Flag size={32} color="#6366F1" />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Milestones
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track your project milestones and progress
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Plus size={20} />}>
          New Milestone
        </Button>
      </Box>

      {milestones.length === 0 ? (
        <Card sx={{ bgcolor: '#151515', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <CardContent sx={{ p: 6 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Flag size={48} color="#6366F1" style={{ margin: '0 auto', marginBottom: '16px' }} />
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                No milestones yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Create milestones to track major project goals and deadlines.
              </Typography>
              <Button variant="contained" startIcon={<Plus size={18} />}>
                Create Milestone
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {milestones.map((milestone) => {
            const progress = calculateProgress(milestone)
            const daysUntilDue = getDaysUntilDue(milestone.dueDate)

            return (
              <Card
                key={milestone.id}
                sx={{
                  bgcolor: '#151515',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'rgba(99, 102, 241, 0.5)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {milestone.title}
                      </Typography>
                      {milestone.description && (
                        <Typography variant="body2" color="text.secondary">
                          {milestone.description}
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton size="small">
                        <Edit size={16} />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <Trash2 size={16} />
                      </IconButton>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Progress
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {progress}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: '#6366F1',
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Chip
                      label={`${milestone._count?.issues || 0} issues`}
                      size="small"
                      sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }}
                    />
                    {milestone.dueDate && (
                      <Chip
                        label={`Due: ${format(new Date(milestone.dueDate), 'MMM dd, yyyy')}`}
                        size="small"
                        sx={{
                          bgcolor: daysUntilDue < 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                          color: daysUntilDue < 0 ? '#EF4444' : 'text.secondary',
                        }}
                      />
                    )}
                    {daysUntilDue !== null && daysUntilDue >= 0 && (
                      <Chip
                        label={`${daysUntilDue} days left`}
                        size="small"
                        sx={{
                          bgcolor: daysUntilDue <= 7 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                          color: daysUntilDue <= 7 ? '#F59E0B' : 'text.secondary',
                        }}
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            )
          })}
        </Box>
      )}
    </Box>
  )
}

export default Milestones
