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
import { Github } from 'lucide-react'

function LoginPage() {
  const handleGitHubLogin = () => {
    window.location.href = 'http://localhost:3000/auth/github'
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A2E 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
          top: '10%',
          left: '20%',
          animation: 'pulse 4s ease-in-out infinite',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
          bottom: '10%',
          right: '20%',
          animation: 'pulse 5s ease-in-out infinite',
        }}
      />

      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 1,
            position: 'relative',
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: 'rgba(99, 102, 241, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
            }}
          >
            <Github size={48} color="#6366F1" strokeWidth={1.5} />
          </Box>

          <Typography
            component="h1"
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 1,
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            DevDash
          </Typography>

          <Typography variant="h6" color="text.secondary" align="center" gutterBottom>
            Agile Project Tracker for Developers
          </Typography>

          <Card
            sx={{
              mt: 4,
              width: '100%',
              bgcolor: 'rgba(21, 21, 21, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h5"
                component="h2"
                sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}
              >
                Welcome to DevDash
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
                Seamlessly manage your projects with GitHub integration. Track issues, manage
                milestones, and automate your development workflow.
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Github size={24} />}
                  onClick={handleGitHubLogin}
                  sx={{
                    px: 6,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: 'none',
                  }}
                >
                  Login with GitHub
                </Button>
              </Box>
            </CardContent>
          </Card>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
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

      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 0.5; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.1); }
          }
        `}
      </style>
    </Box>
  )
}

export default LoginPage
