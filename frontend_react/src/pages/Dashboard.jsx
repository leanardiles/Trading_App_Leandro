import React, { useState, useEffect } from 'react'
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material'
import {
  AccountBalance,
  TrendingUp,
  ShowChart,
  Assessment,
  ArrowForward,
} from '@mui/icons-material'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useNavigate } from 'react-router-dom'
import { portfolioAPI, transactionAPI, holdingAPI } from '../services/api'
import { formatCurrency } from '../utils/format'

export default function Dashboard() {
  const navigate = useNavigate()
  const [portfolioSummary, setPortfolioSummary] = useState(null)
  const [recentTransactions, setRecentTransactions] = useState([])
  const [holdingsSummary, setHoldingsSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Performance chart states
  const [chartData, setChartData] = useState([])
  const [loadingChart, setLoadingChart] = useState(false)
  const [timePeriod, setTimePeriod] = useState('1M')

  useEffect(() => {
    loadDashboardData()
    loadPerformanceChart()
  }, [])

  useEffect(() => {
    loadPerformanceChart()
  }, [timePeriod])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [portfolioRes, transactionsRes, holdingsRes] = await Promise.all([
        portfolioAPI.summary(),
        transactionAPI.recent(),
        holdingAPI.summary(),
      ])

      setPortfolioSummary(portfolioRes.data)
      setRecentTransactions(transactionsRes.data)
      setHoldingsSummary(holdingsRes.data)
    } catch (err) {
      setError('Failed to load dashboard data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadPerformanceChart = async () => {
    setLoadingChart(true)
    try {
      const response = await portfolioAPI.getPortfolioHistory(timePeriod)
      const data = response.data.data.map(item => ({
        date: new Date(item.date).toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric',
          hour: timePeriod === '1D' ? '2-digit' : undefined,
          minute: timePeriod === '1D' ? '2-digit' : undefined
        }),
        value: item.total_value
      }))
      setChartData(data)
    } catch (err) {
      console.error('Failed to load performance chart:', err)
      setChartData([])
    } finally {
      setLoadingChart(false)
    }
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

  const statCards = [
    {
      title: 'Total Balance',
      value: formatCurrency(portfolioSummary?.total_balance || 0),
      icon: <AccountBalance />,
      color: '#1976d2',
    },
    {
      title: 'Total Invested',
      value: formatCurrency(portfolioSummary?.total_invested || 0),
      icon: <ShowChart />,
      color: '#2e7d32',
    },
    {
      title: 'Current Value',
      value: formatCurrency(portfolioSummary?.total_current_value || 0),
      icon: <TrendingUp />,
      color: '#ed6c02',
    },
    {
      title: 'Total P/L',
      value: formatCurrency(portfolioSummary?.total_profit_loss || 0),
      icon: <Assessment />,
      color: portfolioSummary?.total_profit_loss >= 0 ? '#2e7d32' : '#d32f2f',
      percentage: parseFloat(portfolioSummary?.total_profit_loss_percentage || 0),
    },
  ]

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      {card.title}
                    </Typography>
                    <Typography variant="h5" component="div">
                      {card.value}
                    </Typography>
                    {card.percentage !== undefined && (
                      <Typography
                        variant="body2"
                        color={card.percentage >= 0 ? 'success.main' : 'error.main'}
                        sx={{ mt: 1 }}
                      >
                        {card.percentage >= 0 ? '+' : ''}
                        {Number(card.percentage).toFixed(2)}%
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ color: card.color, fontSize: 40 }}>{card.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Portfolio Performance Chart - REPLACES Portfolio Summary */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Portfolio Performance</Typography>
              
              {/* Time Period Buttons */}
              <Box display="flex" gap={1}>
                {['1W', '1M', '3M'].map((period) => (
                  <Button
                    key={period}
                    variant={timePeriod === period ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => setTimePeriod(period)}
                  >
                    {period}
                  </Button>
                ))}
              </Box>
            </Box>

            {/* Chart */}
            {loadingChart ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress size={30} />
              </Box>
            ) : chartData.length > 0 ? (
              <Box sx={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis 
                      tick={{ fontSize: 11 }}
                      tickFormatter={(value) => `$${value.toFixed(0)}`}
                    />
                    <Tooltip 
                      formatter={(value) => [`$${value.toFixed(2)}`, 'Portfolio Value']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#1976d2" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            ) : (
              <Alert severity="info" sx={{ mt: 2 }}>
                No performance data yet. Data accumulates as prices update.
              </Alert>
            )}

            {/* Link to Performance Page */}
            <Box 
              sx={{ 
                mt: 3, 
                pt: 2, 
                borderTop: '1px solid', 
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Typography variant="body2" color="textSecondary">
                For granular performance visualization
              </Typography>
              <Button
                variant="outlined"
                size="small"
                endIcon={<ArrowForward />}
                onClick={() => navigate('/performance')}
              >
                View Full Performance
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Recent Transactions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Transactions
            </Typography>
            {recentTransactions.length > 0 ? (
              <Box sx={{ mt: 2 }}>
                {recentTransactions.slice(0, 5).map((transaction) => (
                  <Box
                    key={transaction.id}
                    display="flex"
                    justifyContent="space-between"
                    mb={1}
                    sx={{
                      p: 1,
                      bgcolor: 'background.default',
                      borderRadius: 1,
                    }}
                  >
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {transaction.transaction_type.toUpperCase()}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(transaction.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      color={
                        transaction.credit > 0 ? 'success.main' : 'error.main'
                      }
                      fontWeight="bold"
                    >
                      {transaction.credit > 0 ? '+' : ''}
                      {formatCurrency(transaction.credit - transaction.debit)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                No recent transactions
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}