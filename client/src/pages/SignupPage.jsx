import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Container,
  TextField,
  Divider,
} from '@mui/material'
import { Github, Mail, Lock, User, FileText } from 'lucide-react'
import toast from 'react-hot-toast'

function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    bio: '',
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    // Check password complexity
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!passwordRegex.test(formData.password)) {
      toast.error('Password must contain uppercase, lowercase, number, and special character')
      return
    }
    
    setLoading(true)
    
    try {
      const res = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      })
      
      const data = await res.json()
      
      if (res.ok) {
        toast.success('Account created successfully!')
        navigate('/login')
      } else {
        toast.error(data.message || 'Registration failed')
      }
    } catch (error) {
      toast.error('Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGitHubSignup = () => {
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
            Create your account
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
                Join DevDash
              </Typography>

              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  sx={{ mb: 2 }}
                  required
                  InputProps={{
                    startAdornment: <Mail size={20} style={{ marginRight: 8, color: '#9CA3AF' }} />,
                  }}
                />
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                    InputProps={{
                      startAdornment: <User size={20} style={{ marginRight: 8, color: '#9CA3AF' }} />,
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                    InputProps={{
                      startAdornment: <User size={20} style={{ marginRight: 8, color: '#9CA3AF' }} />,
                    }}
                  />
                </Box>
                <TextField
                  fullWidth
                  label="Username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  sx={{ mb: 2 }}
                  required
                  InputProps={{
                    startAdornment: <User size={20} style={{ marginRight: 8, color: '#9CA3AF' }} />,
                  }}
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  sx={{ mb: 2 }}
                  required
                  helperText="Must contain: uppercase, lowercase, number, and special character"
                  InputProps={{
                    startAdornment: <Lock size={20} style={{ marginRight: 8, color: '#9CA3AF' }} />,
                  }}
                />
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  sx={{ mb: 2 }}
                  required
                  InputProps={{
                    startAdornment: <Lock size={20} style={{ marginRight: 8, color: '#9CA3AF' }} />,
                  }}
                />
                <TextField
                  fullWidth
                  label="Bio (Optional)"
                  multiline
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: <FileText size={20} style={{ marginRight: 8, color: '#9CA3AF', marginTop: -40 }} />,
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: 'none',
                    mb: 2,
                  }}
                >
                  {loading ? 'Creating account...' : 'Sign Up'}
                </Button>
              </Box>

              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  OR
                </Typography>
              </Divider>

              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={<Github size={20} />}
                onClick={handleGitHubSignup}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: 'none',
                  mb: 2,
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                }}
              >
                Sign up with GitHub
              </Button>

              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <Link to="/login" style={{ color: '#6366F1', textDecoration: 'none' }}>
                    Sign in
                  </Link>
                </Typography>
              </Box>
            </CardContent>
          </Card>
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

export default SignupPage
