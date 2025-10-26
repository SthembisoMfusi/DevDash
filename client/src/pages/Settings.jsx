import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
} from '@mui/material'
import { Settings as SettingsIcon, Github, ExternalLink, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

function Settings() {
  const [repositories, setRepositories] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [selectedRepo, setSelectedRepo] = useState('')
  const [selectedProject, setSelectedProject] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [reposRes, projectsRes] = await Promise.all([
        fetch('http://localhost:3000/github/repositories', {
          credentials: 'include',
        }),
        fetch('http://localhost:3000/projects', {
          credentials: 'include',
        }),
      )

      if (reposRes.ok) {
        const repos = await reposRes.json()
        setRepositories(repos)
      }

      if (projectsRes.ok) {
        const projs = await projectsRes.json()
        setProjects(projs)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load GitHub repositories')
    } finally {
      setLoading(false)
    }
  }

  const handleImportRepo = async () => {
    if (!selectedRepo || !selectedProject) {
      toast.error('Please select both a repository and a project')
      return
    }

    try {
      const repo = repositories.find((r) => r.id === parseInt(selectedRepo))
      const response = await fetch(
        `http://localhost:3000/projects/${selectedProject}/repositories`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            fullName: repo.fullName,
            owner: repo.owner,
            name: repo.name,
            description: repo.description,
            private: repo.private,
            htmlUrl: repo.htmlUrl,
            cloneUrl: repo.cloneUrl,
          }),
        }
      )

      if (response.ok) {
        toast.success(`Linked ${repo.name} to project`)
        setImportDialogOpen(false)
        setSelectedRepo('')
        setSelectedProject('')
        fetchData()
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to link repository')
      }
    } catch (error) {
      console.error('Error linking repository:', error)
      toast.error('Failed to link repository')
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <SettingsIcon size={32} color="#6366F1" />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Settings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your account and GitHub integrations
          </Typography>
        </Box>
      </Box>

      {/* GitHub Repositories Section */}
      <Card sx={{ bgcolor: '#151515', border: '1px solid rgba(255, 255, 255, 0.1)', mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Github size={28} color="#6366F1" />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  GitHub Repositories
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Link your GitHub repositories to projects
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                size="small"
                startIcon={<RefreshCw size={18} />}
                onClick={fetchData}
                variant="outlined"
              >
                Refresh
              </Button>
              <Button
                size="small"
                startIcon={<Github size={18} />}
                onClick={() => setImportDialogOpen(true)}
                variant="contained"
              >
                Link Repository
              </Button>
            </Box>
          </Box>

          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 3 }} />

          {repositories.length === 0 ? (
            <Alert severity="info">
              No GitHub repositories found. Make sure you're authenticated with GitHub.
            </Alert>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {repositories.map((repo) => (
                <Box
                  key={repo.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'rgba(255, 255, 255, 0.02)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                    },
                  }}
                >
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {repo.name}
                      </Typography>
                      {repo.private && (
                        <Chip label="Private" size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {repo.owner}/{repo.name}
                    </Typography>
                    {repo.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {repo.description}
                      </Typography>
                    )}
                  </Box>
                  <Button
                    size="small"
                    startIcon={<ExternalLink size={16} />}
                    href={repo.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open
                  </Button>
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Import Dialog */}
      <Dialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Link GitHub Repository to Project</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Repository</InputLabel>
            <Select
              value={selectedRepo}
              label="Repository"
              onChange={(e) => setSelectedRepo(e.target.value)}
            >
              {repositories.map((repo) => (
                <MenuItem key={repo.id} value={repo.id}>
                  {repo.owner}/{repo.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Project</InputLabel>
            <Select
              value={selectedProject}
              label="Project"
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              {projects.map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setImportDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleImportRepo}>
            Link Repository
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Settings
