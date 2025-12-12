import React, { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material'
import {
  Person,
  Email,
  AccountBalance,
  CalendarToday,
  Lock,
} from '@mui/icons-material'
import { authAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { formatCurrency } from '../utils/format'
import { toast } from 'react-toastify'

export default function Profile() {
  const { user: authUser, setUser: setAuthUser } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [profile, setProfile] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
  })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const response = await authAPI.getProfile()
      setProfile(response.data)
      setFormData({
        name: response.data.name || '',
        email: response.data.email || '',
        username: response.data.username || '',
      })
    } catch (err) {
      setError('Failed to load profile')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError('')
      const response = await authAPI.updateProfile(formData)
      setProfile(response.data)
      setAuthUser(response.data)
      localStorage.setItem('user', JSON.stringify(response.data))
      setEditMode(false)
      toast.success('Profile updated successfully')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile')
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: profile?.name || '',
      email: profile?.email || '',
      username: profile?.username || '',
    })
    setEditMode(false)
    setError('')
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  if (!profile) {
    return <Alert severity="error">Failed to load profile</Alert>
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleString()
    } catch {
      return dateString
    }
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
        Profile
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Information Card */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" sx={{ color: 'primary.main' }}>
                  Personal Information
                </Typography>
                {!editMode && (
                  <Button
                    variant="contained"
                    onClick={() => setEditMode(true)}
                    sx={{ bgcolor: 'primary.main', color: 'secondary.main' }}
                  >
                    Edit Profile
                  </Button>
                )}
              </Box>
              <Divider sx={{ mb: 3 }} />

              {editMode ? (
                <Box>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    margin="normal"
                    required
                    disabled
                    helperText="Email cannot be changed"
                  />
                  <TextField
                    fullWidth
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    margin="normal"
                    required
                  />
                  <Box display="flex" gap={2} mt={3}>
                    <Button
                      variant="contained"
                      onClick={handleSave}
                      disabled={saving}
                      sx={{ bgcolor: 'primary.main', color: 'secondary.main' }}
                    >
                      {saving ? <CircularProgress size={24} /> : 'Save Changes'}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleCancel}
                      disabled={saving}
                      sx={{ borderColor: 'primary.main', color: 'primary.main' }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Person sx={{ mr: 2, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Full Name
                        </Typography>
                        <Typography variant="body1">{profile.name || 'N/A'}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Email sx={{ mr: 2, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Email
                        </Typography>
                        <Typography variant="body1">{profile.email || 'N/A'}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Person sx={{ mr: 2, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Username
                        </Typography>
                        <Typography variant="body1">{profile.username || 'N/A'}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Lock sx={{ mr: 2, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          User ID
                        </Typography>
                        <Typography variant="body1">{profile.userid || 'N/A'}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Account Statistics Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                Account Statistics
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Box display="flex" alignItems="center" mb={3}>
                <AccountBalance sx={{ mr: 2, color: 'primary.main', fontSize: 40 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Account Balance
                  </Typography>
                  <Typography variant="h5" sx={{ color: 'primary.main' }}>
                    {formatCurrency(profile.balance || 0)}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" mb={3}>
                <CalendarToday sx={{ mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Member Since
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(profile.date_joined)}
                  </Typography>
                </Box>
              </Box>

              {profile.last_login && (
                <Box display="flex" alignItems="center">
                  <Lock sx={{ mr: 2, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Last Login
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(profile.last_login)}
                    </Typography>
                  </Box>
                </Box>
              )}

              <Box mt={3} p={2} sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Account Status
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: profile.is_active ? 'success.main' : 'error.main',
                    fontWeight: 'bold',
                  }}
                >
                  {profile.is_active ? 'Active' : 'Inactive'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

