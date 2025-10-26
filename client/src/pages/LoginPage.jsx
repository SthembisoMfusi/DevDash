import React from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Container,
  Avatar,
} from '@mui/material'
import { GitHub } from '@mui/icons-material'

function LoginPage() {
  const handleGitHubLogin = () => {
    window.location.href = 'http://localhost:3000/auth/github'
  }

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: 64, height: 64 }}>
          <GitHub sx={{ fontSize: 40 }} />
        </Avatar>
        <Typography component="h1" variant="h4" gutterBottom>
          DevDash
        </Typography>
        <Typography variant="h6" color="text.secondary" align="center" gutterBottom>
          Agile Project Tracker for Developers
        </Typography>
        <Card sx={{ mt: 3, width: '100%' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom align="center">
              Welcome to DevDash
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center" paragraph>
              Seamlessly manage your projects with GitHub integration. Track issues, 
              manage milestones, and automate your development workflow.
            </Typography>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<GitHub />}
                onClick={handleGitHubLogin}
                sx={{ px: 4, py: 1.5 }}
              >
                Login with GitHub
              </Button>
            </Box>
          </CardContent>
        </Card>
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Features:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • GitHub Integration • Issue Tracking • Milestone Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Automated Workflows • Real-time Updates • Team Collaboration
          </Typography>
        </Box>
      </Box>
    </Container>
  )
}

export default LoginPage
