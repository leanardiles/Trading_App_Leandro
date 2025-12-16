import React, { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material'
import { AutoAwesome, Add, TrendingUp, TrendingDown } from '@mui/icons-material'
import { hermAPI, portfolioAPI } from '../services/api'
import { toast } from 'react-toastify'
import { formatCurrency, formatPercentage } from '../utils/format'

export default function HermesAgent() {
  const [activeTab, setActiveTab] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [bots, setBots] = useState([])
  const [loadingBots, setLoadingBots] = useState(true)
  const [userBalance, setUserBalance] = useState(0)

  // Bot creation form state
  const [investmentAmount, setInvestmentAmount] = useState('')
  const [riskLevel, setRiskLevel] = useState('MEDIUM')
  const [durationWeeks, setDurationWeeks] = useState(4)

  useEffect(() => {
    loadBots()
    loadUserBalance()
  }, [])

  const loadUserBalance = async () => {
    try {
      const response = await portfolioAPI.summary()
      setUserBalance(response.data.total_balance || 0)
    } catch (err) {
      console.error('Failed to load balance:', err)
    }
  }

  const loadBots = async () => {
    try {
      setLoadingBots(true)
      const response = await hermAPI.listBots()
      setBots(response.data.bots || [])
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load bots')
      toast.error('Failed to load bots')
    } finally {
      setLoadingBots(false)
    }
  }

  const handleCreateBot = async (e) => {
    e.preventDefault()
    if (!investmentAmount || parseFloat(investmentAmount) < 100) {
      setError('Minimum investment is $100')
      return
    }

    if (parseFloat(investmentAmount) > userBalance) {
      setError(`Insufficient balance. Available: ${formatCurrency(userBalance)}`)
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await hermAPI.createBot({
        investment_amount: parseFloat(investmentAmount),
        risk_level: riskLevel,
        duration_weeks: parseInt(durationWeeks),
      })

      toast.success('Herm_trades bot created successfully!')
      setInvestmentAmount('')
      setRiskLevel('MEDIUM')
      setDurationWeeks(4)
      await loadBots()
      await loadUserBalance()
      setActiveTab(1) // Switch to bots list tab
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to create bot'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'success'
      case 'PAUSED':
        return 'warning'
      case 'STOPPED':
        return 'error'
      case 'COMPLETED':
        return 'info'
      default:
        return 'default'
    }
  }

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'LOW':
        return 'success'
      case 'MEDIUM':
        return 'warning'
      case 'HIGH':
        return 'error'
      default:
        return 'default'
    }
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <AutoAwesome sx={{ fontSize: 40, color: '#febc4c' }} />
        <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
          Hermes Agent
        </Typography>
      </Box>

      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{
          mb: 3,
          '& .MuiTab-root': {
            color: '#b0b0b0',
            '&.Mui-selected': {
              color: '#febc4c',
            },
          },
          '& .MuiTabs-indicator': {
            backgroundColor: '#febc4c',
          },
        }}
      >
        <Tab label="Create Bot" />
        <Tab label="My Bots" />
      </Tabs>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ bgcolor: '#15182e', color: '#ffffff' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, color: '#febc4c' }}>
                  Create Herm_trades AI Bot
                </Typography>
                <Typography variant="body2" sx={{ mb: 3, color: '#b0b0b0' }}>
                  Create an automated trading bot that uses AI strategies including pivot point analysis,
                  next-day prediction, stock screener, and index rebalancing.
                </Typography>

                <Box component="form" onSubmit={handleCreateBot}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Investment Amount"
                        type="number"
                        value={investmentAmount}
                        onChange={(e) => setInvestmentAmount(e.target.value)}
                        placeholder="1000"
                        required
                        inputProps={{ min: 100, step: 100 }}
                        helperText={`Available balance: ${formatCurrency(userBalance)}`}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#ffffff',
                            '& fieldset': {
                              borderColor: '#3a3f5a',
                            },
                            '&:hover fieldset': {
                              borderColor: '#febc4c',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#febc4c',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: '#b0b0b0',
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#febc4c',
                          },
                          '& .MuiFormHelperText-root': {
                            color: '#b0b0b0',
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel sx={{ color: '#b0b0b0' }}>Risk Level</InputLabel>
                        <Select
                          value={riskLevel}
                          onChange={(e) => setRiskLevel(e.target.value)}
                          label="Risk Level"
                          sx={{
                            color: '#ffffff',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#3a3f5a',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#febc4c',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#febc4c',
                            },
                            '& .MuiSvgIcon-root': {
                              color: '#b0b0b0',
                            },
                          }}
                        >
                          <MenuItem value="LOW">Low Risk (2% monthly return)</MenuItem>
                          <MenuItem value="MEDIUM">Medium Risk (5% monthly return)</MenuItem>
                          <MenuItem value="HIGH">High Risk (10% monthly return)</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Duration (weeks)"
                        type="number"
                        value={durationWeeks}
                        onChange={(e) => setDurationWeeks(e.target.value)}
                        required
                        inputProps={{ min: 1, max: 52 }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#ffffff',
                            '& fieldset': {
                              borderColor: '#3a3f5a',
                            },
                            '&:hover fieldset': {
                              borderColor: '#febc4c',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#febc4c',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: '#b0b0b0',
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#febc4c',
                          },
                        }}
                      />
                    </Grid>

                    {error && (
                      <Grid item xs={12}>
                        <Alert severity="error" sx={{ bgcolor: '#2d1b1b', color: '#ff6b6b' }}>
                          {error}
                        </Alert>
                      </Grid>
                    )}

                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : <Add />}
                        sx={{
                          bgcolor: '#febc4c',
                          color: '#0c0f27',
                          fontWeight: 'bold',
                          py: 1.5,
                          '&:hover': {
                            bgcolor: '#e0a840',
                          },
                          '&:disabled': {
                            bgcolor: '#3a3f5a',
                            color: '#666666',
                          },
                        }}
                      >
                        {loading ? 'Creating Bot...' : 'Create Herm_trades Bot'}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: '#15182e', color: '#ffffff' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, color: '#febc4c' }}>
                  Risk Profiles
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: '#b0b0b0', mb: 1 }}>
                    Low Risk
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#ffffff', mb: 2 }}>
                    • 2% expected monthly return<br />
                    • 5% stop loss<br />
                    • 10% take profit<br />
                    • Max 20% per position
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: '#b0b0b0', mb: 1 }}>
                    Medium Risk
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#ffffff', mb: 2 }}>
                    • 5% expected monthly return<br />
                    • 8% stop loss<br />
                    • 15% take profit<br />
                    • Max 30% per position
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#b0b0b0', mb: 1 }}>
                    High Risk
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#ffffff' }}>
                    • 10% expected monthly return<br />
                    • 15% stop loss<br />
                    • 25% take profit<br />
                    • Max 40% per position
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Card sx={{ bgcolor: '#15182e', color: '#ffffff' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, color: '#febc4c' }}>
              My Trading Bots
            </Typography>

            {loadingBots ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            ) : bots.length === 0 ? (
              <Alert severity="info" sx={{ bgcolor: '#1a1f35', color: '#ffffff' }}>
                No bots created yet. Create your first bot to get started!
              </Alert>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: '#febc4c' }}>Bot Name</TableCell>
                      <TableCell sx={{ color: '#febc4c' }}>Risk Level</TableCell>
                      <TableCell sx={{ color: '#febc4c' }}>Status</TableCell>
                      <TableCell align="right" sx={{ color: '#febc4c' }}>Investment</TableCell>
                      <TableCell align="right" sx={{ color: '#febc4c' }}>Current Value</TableCell>
                      <TableCell align="right" sx={{ color: '#febc4c' }}>P/L</TableCell>
                      <TableCell align="right" sx={{ color: '#febc4c' }}>ROI</TableCell>
                      <TableCell align="right" sx={{ color: '#febc4c' }}>Trades</TableCell>
                      <TableCell align="right" sx={{ color: '#febc4c' }}>Win Rate</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bots.map((bot) => (
                      <TableRow key={bot.id}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {bot.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={bot.risk_level}
                            color={getRiskColor(bot.risk_level)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={bot.status}
                            color={getStatusColor(bot.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(bot.initial_capital)}
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(bot.current_capital)}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            color: bot.total_profit_loss >= 0 ? '#4caf50' : '#f44336',
                            fontWeight: 'bold',
                          }}
                        >
                          {bot.total_profit_loss >= 0 ? (
                            <TrendingUp sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                          ) : (
                            <TrendingDown sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                          )}
                          {formatCurrency(bot.total_profit_loss)}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            color: bot.roi_percentage >= 0 ? '#4caf50' : '#f44336',
                            fontWeight: 'bold',
                          }}
                        >
                          {formatPercentage(bot.roi_percentage)}
                        </TableCell>
                        <TableCell align="right">{bot.total_trades}</TableCell>
                        <TableCell align="right">
                          {formatPercentage(bot.win_rate)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  )
}
