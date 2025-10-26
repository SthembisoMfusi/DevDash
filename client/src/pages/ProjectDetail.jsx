import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material'
import { Folder, Plus, FileText, Settings as SettingsIcon } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import KanbanBoard from '../components/KanbanBoard'
import CreateIssueModal from '../components/CreateIssueModal'
import EmptyState from '../components/EmptyState'

function ProjectDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [createIssueOpen, setCreateIssueOpen] = useState(false)

  useEffect(() => {
    fetchProject()
  }, [id])

  const fetchProject = async () => {
    try {
      const response = await fetch(`http://localhost:3000/projects/${id}`, {
        credentials: 'include',
      })

      if (response.ok) {
        const projectData = await response.json()
        setProject(projectData)
        setIssues(projectData.issues || [])
      } else {
        setError('Failed to load project')
      }
    } catch (error) {
      console.error('Error fetching project:', error)
      setError('Failed to load project')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (issueId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:3000/issues/${issueId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        const updatedIssue = await response.json()
        setIssues((prevIssues) =>
          prevIssues.map((issue) => (issue.id === issueId ? updatedIssue : issue))
        )
      } else {
        throw new Error('Failed to update issue')
      }
    } catch (error) {
      console.error('Error updating issue:', error)
      toast.error('Failed to update issue status')
      throw error
    }
  }

  const handleIssueCreated = (newIssue) => {
    setIssues([...issues, newIssue])
    fetchProject() // Refresh to get updated counts
  }

  const handleIssueClick = (issue) => {
    navigate(`/issues/${issue.id}`)
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

  if (!project) {
    return <Alert severity="info">Project not found</Alert>
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Folder size={32} color="#6366F1" />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {project.name}
            </Typography>
            {project.description && (
              <Typography variant="body2" color="text.secondary">
                {project.description}
              </Typography>
            )}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton>
            <SettingsIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={() => setCreateIssueOpen(true)}
          >
            New Issue
          </Button>
        </Box>
      </Box>

      {issues.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No issues yet"
          description="Get started by creating your first issue for this project."
          actionLabel="Create First Issue"
          onAction={() => setCreateIssueOpen(true)}
        />
      ) : (
        <KanbanBoard
          issues={issues}
          onStatusChange={handleStatusChange}
          onIssueClick={handleIssueClick}
        />
      )}

      <CreateIssueModal
        open={createIssueOpen}
        onClose={() => setCreateIssueOpen(false)}
        projectId={project.id}
        onCreated={handleIssueCreated}
      />
    </Box>
  )
}

export default ProjectDetail
