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
  IconButton,
} from '@mui/material'
import {
  Folder,
  FileText,
  Flag,
  TrendingUp,
  Plus,
  ArrowRight,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import CreateProjectModal from '../components/CreateProjectModal'
import EmptyState from '../components/EmptyState'

function Dashboard() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [createProjectOpen, setCreateProjectOpen] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:3000/projects', {
        credentials: 'include',
      })

      if (response.ok) {
        const projectsData = await response.json()
        setProjects(projectsData)
        setError(null)
      } else {
        setError('Failed to load projects')
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleProjectCreated = (newProject) => {
    setProjects([newProject, ...projects])
  }

  const stats = {
    totalProjects: projects.length,
    totalIssues: projects.reduce((sum, p) => sum + (p._count?.issues || 0), 0),
    completedIssues: 0, // Will be calculated when we have issues
    activeMilestones: projects.reduce((sum, p) => sum + (p._count?.milestones || 0), 0),
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
      {/* Header Section */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Overview of your projects and activity
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={() => setCreateProjectOpen(true)}
          sx={{ borderRadius: 2 }}
        >
          New Project
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#151515', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#6366F1' }}>
                    {stats.totalProjects}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                    Projects
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    bgcolor: 'rgba(99, 102, 241, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Folder size={28} color="#6366F1" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#151515', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#F59E0B' }}>
                    {stats.totalIssues}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                    Total Issues
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    bgcolor: 'rgba(245, 158, 11, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FileText size={28} color="#F59E0B" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#151515', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#10B981' }}>
                    {stats.completedIssues}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                    Completed
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    bgcolor: 'rgba(16, 185, 129, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TrendingUp size={28} color="#10B981" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#151515', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#3B82F6' }}>
                    {stats.activeMilestones}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                    Milestones
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    bgcolor: 'rgba(59, 130, 246, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Flag size={28} color="#3B82F6" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Projects Section */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Your Projects
          </Typography>
          {projects.length > 0 && (
            <Button
              size="small"
              endIcon={<ArrowRight size={16} />}
              onClick={() => navigate('/projects')}
              sx={{ color: 'text.secondary' }}
            >
              View all
            </Button>
          )}
        </Box>

        {projects.length === 0 ? (
          <EmptyState
            icon={Folder}
            title="No projects yet"
            description="Get started by creating your first project to organize and track your development work."
            actionLabel="Create Your First Project"
            onAction={() => setCreateProjectOpen(true)}
          />
        ) : (
          <Grid container spacing={3}>
            {projects.map((project) => (
              <Grid item xs={12} sm={6} md={4} key={project.id}>
                <Card
                  sx={{
                    bgcolor: '#151515',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: 'rgba(99, 102, 241, 0.5)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(99, 102, 241, 0.1)',
                    },
                  }}
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="start" justifyContent="space-between" mb={2}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          bgcolor: 'rgba(99, 102, 241, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Folder size={24} color="#6366F1" />
                      </Box>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/projects/${project.id}`)
                        }}
                      >
                        <ArrowRight size={16} />
                      </IconButton>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {project.name}
                    </Typography>
                    {project.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {project.description}
                      </Typography>
                    )}
                    <Box display="flex" gap={2} mt={2}>
                      <Chip
                        label={`${project._count?.issues || 0} issues`}
                        size="small"
                        sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }}
                      />
                      <Chip
                        label={`${project._count?.milestones || 0} milestones`}
                        size="small"
                        sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <CreateProjectModal
        open={createProjectOpen}
        onClose={() => setCreateProjectOpen(false)}
        onCreated={handleProjectCreated}
      />
    </Box>
  )
}

export default Dashboard
