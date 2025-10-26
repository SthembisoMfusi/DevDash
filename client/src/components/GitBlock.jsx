import React from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Divider,
  Link,
  Avatar,
  IconButton,
} from '@mui/material'
import { GitBranch, GitMerge, CheckCircle2, XCircle, Clock, ExternalLink } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

function GitBlock({ issueId, branches = [], commits = [], pullRequests = [] }) {
  const getPRStatusColor = (state, merged) => {
    if (merged) return '#10B981'
    if (state === 'OPEN') return '#3B82F6'
    return '#6B7280'
  }

  const getPRStatusIcon = (state, merged) => {
    if (merged) return <CheckCircle2 size={16} />
    if (state === 'OPEN') return <Clock size={16} />
    return <XCircle size={16} />
  }

  const getCIStatusColor = (status) => {
    if (status === 'PASSING') return '#10B981'
    if (status === 'FAILING') return '#EF4444'
    return '#9CA3AF'
  }

  if (branches.length === 0 && commits.length === 0 && pullRequests.length === 0) {
    return (
      <Card sx={{ bgcolor: '#151515', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary" align="center">
            No Git activity linked to this issue yet.
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card sx={{ bgcolor: '#151515', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <GitBranch size={24} color="#6366F1" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Git Information
          </Typography>
        </Box>

        <Divider sx={{ mb: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Branches */}
        {branches.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'text.secondary' }}>
              Branches ({branches.length})
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {branches.map((branch) => (
                <Box
                  key={branch.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1.5,
                    borderRadius: 1,
                    bgcolor: 'rgba(255, 255, 255, 0.02)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <GitBranch size={16} color="#9CA3AF" />
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {branch.name}
                    </Typography>
                  </Box>
                  {branch.htmlUrl && (
                    <IconButton
                      size="small"
                      href={branch.htmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink size={16} />
                    </IconButton>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Commits */}
        {commits.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'text.secondary' }}>
              Recent Commits ({commits.length})
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {commits.slice(0, 5).map((commit) => (
                <Box
                  key={commit.sha}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 1.5,
                    borderRadius: 1,
                    bgcolor: 'rgba(255, 255, 255, 0.02)',
                  }}
                >
                  <Avatar src={commit.author?.avatarUrl} sx={{ width: 24, height: 24 }}>
                    {commit.author?.name?.[0]}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {commit.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {commit.author?.name} • {formatDistanceToNow(new Date(commit.date))} ago
                    </Typography>
                  </Box>
                  {commit.htmlUrl && (
                    <IconButton
                      size="small"
                      href={commit.htmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink size={16} />
                    </IconButton>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Pull Requests */}
        {pullRequests.length > 0 && (
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'text.secondary' }}>
              Pull Requests ({pullRequests.length})
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {pullRequests.map((pr) => (
                <Box
                  key={pr.id}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getPRStatusIcon(pr.state, pr.merged)}
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {pr.title}
                      </Typography>
                    </Box>
                    <Chip
                      label={pr.state}
                      size="small"
                      sx={{
                        bgcolor: `${getPRStatusColor(pr.state, pr.merged)}20`,
                        color: getPRStatusColor(pr.state, pr.merged),
                        fontWeight: 600,
                        height: 22,
                      }}
                    />
                  </Box>

                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                    #{pr.number} • Opened {formatDistanceToNow(new Date(pr.createdAt))} ago
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    {pr.reviewStatus && (
                      <Chip
                        label={`Review: ${pr.reviewStatus}`}
                        size="small"
                        sx={{
                          bgcolor: pr.reviewStatus === 'APPROVED' ? '#10B98120' : '#F59E0B20',
                          color: pr.reviewStatus === 'APPROVED' ? '#10B981' : '#F59E0B',
                          height: 20,
                          fontSize: '0.7rem',
                        }}
                      />
                    )}
                    {pr.ciStatus && (
                      <Chip
                        label={`CI/CD: ${pr.ciStatus}`}
                        size="small"
                        sx={{
                          bgcolor: `${getCIStatusColor(pr.ciStatus)}20`,
                          color: getCIStatusColor(pr.ciStatus),
                          height: 20,
                          fontSize: '0.7rem',
                        }}
                      />
                    )}
                    {pr.htmlUrl && (
                      <IconButton
                        size="small"
                        href={pr.htmlUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink size={16} />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default GitBlock

