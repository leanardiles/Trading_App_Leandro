import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material'
import {
  TrendingUp,
  TrendingDown,
  Visibility,
  Close,
  Refresh,
} from '@mui/icons-material'
import { signalAPI } from '../services/api'
import { formatCurrency } from '../utils/format'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

export default function Signals() {
  const [signals, setSignals] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, unread, buy, sell
  const navigate = useNavigate()

  useEffect(() => {
    loadSignals()
  }, [])

  const loadSignals = async () => {
    try {
      setLoading(true)
      const response = await signalAPI.active()
      setSignals(response.data)
    } catch (err) {
      console.error('Failed to load signals:', err)
      toast.error('Failed to load signals')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkRead = async (signalId) => {
    try {
      await signalAPI.markRead(signalId)
      setSignals(signals.map(s => 
        s.id === signalId ? { ...s, is_read: true } : s
      ))
      toast.success('Signal marked as read')
    } catch (err) {
      toast.error('Failed to mark signal as read')
    }
  }

  const handleDismiss = async (signalId) => {
    try {
      await signalAPI.dismiss(signalId)
      setSignals(signals.filter(s => s.id !== signalId))
      toast.success('Signal dismissed')
    } catch (err) {
      toast.error('Failed to dismiss signal')
    }
  }

  const handleTrade = (stock, action) => {
    // Navigate to Trading page with pre-filled stock
    navigate('/trading', { state: { stock, action } })
  }

  const getActionColor = (action) => {
    switch (action) {
      case 'buy': return 'success'
      case 'sell': return 'error'
      case 'watch': return 'info'
      default: return 'default'
    }
  }

  const getActionIcon = (action) => {
    switch (action) {
      case 'buy': return <TrendingUp />
      case 'sell': return <TrendingDown />
      case 'watch': return <Visibility />
      default: return null
    }
  }

  const filteredSignals = signals.filter(signal => {
    if (filter === 'all') return true
    if (filter === 'unread') return !signal.is_read
    return signal.action === filter
  })

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Trading Signals</Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={loadSignals}
        >
          Refresh
        </Button>
      </Box>

      {/* Filter Tabs */}
      <Tabs
        value={filter}
        onChange={(e, newValue) => setFilter(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab label="All Signals" value="all" />
        <Tab label="Unread" value="unread" />
        <Tab label="Buy" value="buy" />
        <Tab label="Sell" value="sell" />
        <Tab label="Watch" value="watch" />
      </Tabs>

      {/* No Signals */}
      {filteredSignals.length === 0 && (
        <Alert severity="info">
          No signals found. Signals will appear here when stocks enter major indices like NASDAQ 100 or S&P 500.
        </Alert>
      )}

      {/* Signal Cards */}
      <Grid container spacing={3}>
        {filteredSignals.map((signal) => (
          <Grid item xs={12} md={6} key={signal.id}>
            <Card 
              sx={{ 
                borderLeft: signal.is_read ? 'none' : '4px solid #febc4c',
                position: 'relative'
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {signal.stock}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {new Date(signal.created_at).toLocaleDateString()} at{' '}
                      {new Date(signal.created_at).toLocaleTimeString()}
                    </Typography>
                  </Box>
                  <Box display="flex" gap={1}>
                    <Chip
                      icon={getActionIcon(signal.action)}
                      label={signal.action.toUpperCase()}
                      color={getActionColor(signal.action)}
                      size="small"
                    />
                    {!signal.is_read && (
                      <Chip label="NEW" color="warning" size="small" />
                    )}
                  </Box>
                </Box>

                <Typography variant="h6" gutterBottom>
                  {signal.title}
                </Typography>

                <Typography variant="body2" color="textSecondary" paragraph>
                  {signal.description}
                </Typography>

                {signal.index_name && (
                  <Chip
                    label={signal.index_name}
                    variant="outlined"
                    size="small"
                    sx={{ mr: 1 }}
                  />
                )}

                {signal.current_price && (
                  <Typography variant="body2" color="textSecondary" mt={1}>
                    Current Price: {formatCurrency(signal.current_price)}
                  </Typography>
                )}
              </CardContent>

              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Box>
                  {signal.action === 'buy' && (
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      startIcon={<TrendingUp />}
                      onClick={() => handleTrade(signal.stock, 'buy')}
                    >
                      Buy Now
                    </Button>
                  )}
                  {signal.action === 'sell' && (
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      startIcon={<TrendingDown />}
                      onClick={() => handleTrade(signal.stock, 'sell')}
                    >
                      Sell Now
                    </Button>
                  )}
                  {!signal.is_read && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleMarkRead(signal.id)}
                      sx={{ ml: 1 }}
                    >
                      Mark Read
                    </Button>
                  )}
                </Box>
                <IconButton
                  size="small"
                  onClick={() => handleDismiss(signal.id)}
                  color="error"
                >
                  <Close />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}