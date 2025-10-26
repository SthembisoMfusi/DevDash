import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material'
import { FileText } from 'lucide-react'
import toast from 'react-hot-toast'

function CreateIssueModal({ open, onClose, projectId, onCreated }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    storyPoints: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast.error('Title is required')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`http://localhost:3000/projects/${projectId}/issues`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          priority: formData.priority,
          storyPoints: formData.storyPoints ? parseInt(formData.storyPoints) : null,
        }),
      })

      if (response.ok) {
        const issue = await response.json()
        toast.success('Issue created successfully!')
        setFormData({ title: '', description: '', priority: 'MEDIUM', storyPoints: '' })
        onClose()
        if (onCreated) onCreated(issue)
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to create issue')
      }
    } catch (error) {
      console.error('Error creating issue:', error)
      toast.error('Failed to create issue')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setFormData({ title: '', description: '', priority: 'MEDIUM', storyPoints: '' })
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FileText size={24} />
          <Typography variant="h6">Create New Issue</Typography>
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Issue Title"
            fullWidth
            variant="outlined"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            disabled={loading}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            label="Description (optional)"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            disabled={loading}
          />

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority}
                label="Priority"
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                disabled={loading}
              >
                <MenuItem value="LOW">Low</MenuItem>
                <MenuItem value="MEDIUM">Medium</MenuItem>
                <MenuItem value="HIGH">High</MenuItem>
                <MenuItem value="URGENT">Urgent</MenuItem>
              </Select>
            </FormControl>

            <TextField
              margin="dense"
              label="Story Points (optional)"
              type="number"
              fullWidth
              variant="outlined"
              value={formData.storyPoints}
              onChange={(e) => setFormData({ ...formData, storyPoints: e.target.value })}
              disabled={loading}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading || !formData.title.trim()}>
            {loading ? 'Creating...' : 'Create Issue'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default CreateIssueModal


