import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material'
import { ArrowLeft, Edit, MessageSquare } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'
import PriorityIndicator from '../components/PriorityIndicator'
import GitBlock from '../components/GitBlock'
import UserAvatar from '../components/UserAvatar'

function IssueDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [issue, setIssue] = useState(null)
  const [branches, setBranches] = useState([])
  const [commits, setCommits] = useState([])
  const [pullRequests, setPullRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchIssue()
  }, [id])

  const fetchIssue = async () => {
    try {
      const [issueRes, branchesRes, commitsRes, prsRes] = await Promise.all([
        fetch(`http://localhost:3000/issues/${id}`, {
          credentials: 'include',
        }),
        fetch(`http://localhost:3000/issues/${id}/branches`, {
          credentials: 'include',
        }),
        fetch(`http://localhost:3000/issues/${id}/commits`, {
          credentials: 'include',
        }),
        fetch(`http://localhost:3000/issues/${id}/pull-requests`, {
          credentials: 'include',
        }),
      ])

      if (issueRes.ok) {
        const issueData = await issueRes.json()
        setIssue(issueData)
      }

      if (branchesRes.ok) {
        const branchesData = await branchesRes.json()
        setBranches(branchesData)
      }

      if (commitsRes.ok) {
        const commitsData = await commitsRes.json()
        setCommits(commitsData)
      }

      if (prsRes.ok) {
        const prsData = await prsRes.json()
        setPullRequests(prsData)
      }
    } catch (error) {
      console.error('Error fetching issue:', error)
      setError('Failed to load issue')
    } finally {
      setLoading(false)
    }
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

  if (!issue) {
    return <Alert severity="info">Issue not found</Alert>
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton onClick={() => navigate(`/projects/${issue.projectId}`)}>
          <ArrowLeft />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {issue.title}
          </Typography>
        </Box>
        <IconButton>
          <Edit size={18} />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <StatusBadge status={issue.status} size="medium" />
        <PriorityIndicator priority={issue.priority} size="medium" />
        {issue.labels && issue.labels.length > 0 && (
          <>
            {issue.labels.map((label) => (
              <Chip
                key={label}
                label={label}
                size="small"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  color: 'text.secondary',
                }}
              />
            ))}
          </>
        )}
      </Box>

      <Divider sx={{ mb: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

      <Box sx={{ display: 'flex', gap: 3 }}>
        <Box sx={{ flexGrow: 1 }}>
          {issue.description && (
            <Paper
              sx={{
                bgcolor: '#151515',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                p: 3,
                mb: 3,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Description
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {issue.description}
              </Typography>
            </Paper>
          )}

          <GitBlock
            issueId={issue.id}
            branches={branches}
            commits={commits}
            pullRequests={pullRequests}
          />
        </Box>

        <Box sx={{ width: 300 }}>
          <Paper sx={{ bgcolor: '#151515', border: '1px solid rgba(255, 255, 255, 0.1)', p: 2, mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'text.secondary' }}>
              Details
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Assignee
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  {issue.assignee ? (
                    <UserAvatar user={issue.assignee} size={32} />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Unassigned
                    </Typography>
                  )}
                </Box>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Created By
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <UserAvatar user={issue.creator} size={32} />
                </Box>
              </Box>

              {issue.milestone && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Milestone
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 600 }}>
                    {issue.milestone.title}
                  </Typography>
                </Box>
              )}

              {issue.storyPoints && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Story Points
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 600 }}>
                    {issue.storyPoints}
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>

          <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
            <Button variant="contained" startIcon={<MessageSquare size={18} />}>
              Add Comment
            </Button>
            <Button variant="outlined">Edit Issue</Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default IssueDetail
