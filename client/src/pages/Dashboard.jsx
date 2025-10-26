import React, { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Avatar,
  CircularProgress,
  Alert,
} from '@mui/material'
import {
  Add as AddIcon,
  Folder as FolderIcon,
  Assignment as AssignmentIcon,
  Flag as FlagIcon,
  TrendingUp as TrendingUpIcon,
  BugReport as BugIcon,
  Star as StarIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [recentIssues, setRecentIssues] = useState([])
  const [stats, setStats] = useState({
    totalProjects: 0,
    openIssues: 0,
    completedIssues: 0,
    activeMilestones: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [projectsResponse, issuesResponse] = await Promise.all([
        fetch('http://localhost:3000/projects', {
          credentials: 'include',
        }),
        fetch('http://localhost:3000/issues?projectId=1', { // This will need to be dynamic
          credentials: 'include',
        }),
      ])

      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json()
        setProjects(projectsData)
        setStats(prev => ({ ...prev, totalProjects: projectsData.length }))
      }

      if (issuesResponse.ok) {
        const issuesData = await issuesResponse.json()
        setRecentIssues(issuesData.slice(0, 5))
        setStats(prev => ({
          ...prev,
          openIssues: issuesData.filter(issue => issue.status !== 'DONE').length,
          completedIssues: issuesData.filter(issue => issue.status === 'DONE').length,
        }))
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'TODO': return 'default'
      case 'IN_PROGRESS': return 'primary'
      case 'IN_REVIEW': return 'warning'
      case 'DONE': return 'success'
      default: return 'default'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'LOW': return 'success'
      case 'MEDIUM': return 'warning'
      case 'HIGH': return 'error'
      case 'URGENT': return 'error'
      default: return 'default'
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

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <FolderIcon color="primary" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="h6">{stats.totalProjects}</Typography>
                  <Typography color="text.secondary">Projects</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AssignmentIcon color="warning" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="h6">{stats.openIssues}</Typography>
                  <Typography color="text.secondary">Open Issues</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="h6">{stats.completedIssues}</Typography>
                  <Typography color="text.secondary">Completed</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <FlagIcon color="info" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="h6">{stats.activeMilestones}</Typography>
                  <Typography color="text.secondary">Milestones</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Projects Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Recent Projects</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/projects')}
                >
                  New Project
                </Button>
              </Box>
              {projects.length === 0 ? (
                <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
                  No projects yet. Create your first project to get started!
                </Typography>
              ) : (
                <List>
                  {projects.slice(0, 5).map((project) => (
                    <ListItem
                      key={project.id}
                      button
                      onClick={() => navigate(`/projects/${project.id}`)}
                    >
                      <ListItemIcon>
                        <FolderIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={project.name}
                        secondary={`${project._count?.issues || 0} issues`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Issues Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Recent Issues</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/issues')}
                >
                  New Issue
                </Button>
              </Box>
              {recentIssues.length === 0 ? (
                <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
                  No issues yet. Create your first issue to get started!
                </Typography>
              ) : (
                <List>
                  {recentIssues.map((issue) => (
                    <ListItem key={issue.id} button onClick={() => navigate(`/issues/${issue.id}`)}>
                      <ListItemIcon>
                        {issue.labels?.includes('bug') ? <BugIcon /> : <AssignmentIcon />}
                      </ListItemIcon>
                      <ListItemText
                        primary={issue.title}
                        secondary={
                          <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                            <Chip
                              label={issue.status}
                              size="small"
                              color={getStatusColor(issue.status)}
                            />
                            <Chip
                              label={issue.priority}
                              size="small"
                              color={getPriorityColor(issue.priority)}
                            />
                            {issue.assignee && (
                              <Avatar
                                src={issue.assignee.avatarUrl}
                                alt={issue.assignee.name}
                                sx={{ width: 20, height: 20 }}
                              />
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard
