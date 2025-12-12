import React, { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from '@mui/material'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { portfolioAPI, holdingAPI } from '../services/api'
import { formatCurrency, formatPercentage } from '../utils/format'

export default function Performance() {
  const [performance, setPerformance] = useState(null)
  const [holdings, setHoldings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Chart states
  const [viewMode, setViewMode] = useState('portfolio') // 'portfolio' or 'stock'
  const [selectedStock, setSelectedStock] = useState('')
  const [timePeriod, setTimePeriod] = useState('1M')
  const [chartData, setChartData] = useState([])
  const [loadingChart, setLoadingChart] = useState(false)

  useEffect(() => {
    loadPerformanceData()
  }, [])

  useEffect(() => {
    if (viewMode === 'portfolio') {
      loadPortfolioChart()
    } else if (selectedStock) {
      loadStockChart()
    }
  }, [viewMode, selectedStock, timePeriod])

  const loadPerformanceData = async () => {
    try {
      setLoading(true)
      const [performanceRes, holdingsRes] = await Promise.all([
        portfolioAPI.performance(),
        holdingAPI.list(),
      ])

      setPerformance(performanceRes.data)
      const holdingsList = holdingsRes.data.results || holdingsRes.data
      setHoldings(holdingsList)
      
      // Set first stock as default selection
      if (holdingsList.length > 0 && !selectedStock) {
        setSelectedStock(holdingsList[0].stock)
      }
    } catch (err) {
      setError('Failed to load performance data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadPortfolioChart = async () => {
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
      console.error('Failed to load portfolio chart:', err)
      setChartData([])
    } finally {
      setLoadingChart(false)
    }
  }

  const loadStockChart = async () => {
    setLoadingChart(true)
    try {
      const response = await portfolioAPI.getStockHistory(selectedStock, timePeriod)
      const data = response.data.data.map(item => ({
        date: new Date(item.date).toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric',
          hour: timePeriod === '1D' ? '2-digit' : undefined,
          minute: timePeriod === '1D' ? '2-digit' : undefined
        }),
        value: item.value,
        price: item.price
      }))
      setChartData(data)
    } catch (err) {
      console.error('Failed to load stock chart:', err)
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

  const sortedHoldings = [...holdings].sort(
    (a, b) => b.profit_loss_percentage - a.profit_loss_percentage
  )

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Portfolio Performance
      </Typography>

      {/* Performance Chart */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Performance Over Time</Typography>
          
          <Box display="flex" gap={2} alignItems="center">
            {/* View Mode Toggle */}
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, newMode) => newMode && setViewMode(newMode)}
              size="small"
            >
              <ToggleButton value="portfolio">Complete Portfolio</ToggleButton>
              <ToggleButton value="stock">Individual Stock</ToggleButton>
            </ToggleButtonGroup>

            {/* Stock Selector */}
            {viewMode === 'stock' && (
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Select Stock</InputLabel>
                <Select
                  value={selectedStock}
                  label="Select Stock"
                  onChange={(e) => setSelectedStock(e.target.value)}
                >
                  {holdings.map((holding) => (
                    <MenuItem key={holding.id} value={holding.stock}>
                      {holding.stock}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
        </Box>

        {/* Time Period Tabs */}
        <Box display="flex" gap={1} mb={3} justifyContent="center">
          {['1D', '1W', '1M', '3M', '1Y', '5Y'].map((period) => (
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

        {/* Chart */}
        {loadingChart ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : chartData.length > 0 ? (
          <Box sx={{ height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${value.toFixed(2)}`}
                />
                <Tooltip 
                  formatter={(value) => [`$${value.toFixed(2)}`, viewMode === 'portfolio' ? 'Portfolio Value' : 'Stock Value']}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#1976d2" 
                  strokeWidth={2}
                  dot={false}
                  name={viewMode === 'portfolio' ? 'Portfolio Value' : `${selectedStock} Value`}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        ) : (
          <Alert severity="info">
            No performance data available yet. Data will accumulate as prices update every 30 seconds.
          </Alert>
        )}
      </Paper>

      {/* Existing Performance Cards */}
      {performance && (
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Total Return
                </Typography>
                <Typography
                  variant="h4"
                  color={performance.total_return >= 0 ? 'success.main' : 'error.main'}
                >
                  {formatCurrency(performance.total_return)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {performance.best_performer && (
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Best Performer
                  </Typography>
                  <Typography variant="h6" color="success.main">
                    {performance.best_performer.stock}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    {formatPercentage(performance.best_performer.profit_loss_percentage)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {formatCurrency(performance.best_performer.profit_loss)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}

          {performance.worst_performer && (
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Worst Performer
                  </Typography>
                  <Typography variant="h6" color="error.main">
                    {performance.worst_performer.stock}
                  </Typography>
                  <Typography variant="body2" color="error.main">
                    {formatPercentage(performance.worst_performer.profit_loss_percentage)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {formatCurrency(performance.worst_performer.profit_loss)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      )}

      {/* Holdings Performance Table */}
      <Paper sx={{ mt: 3, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Holdings Performance Ranking
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Invested</TableCell>
                <TableCell align="right">Current Value</TableCell>
                <TableCell align="right">P/L</TableCell>
                <TableCell align="right">P/L %</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedHoldings.length > 0 ? (
                sortedHoldings.map((holding, index) => (
                  <TableRow key={holding.id}>
                    <TableCell>
                      <Typography
                        variant="h6"
                        color={
                          index === 0
                            ? 'success.main'
                            : index === sortedHoldings.length - 1
                            ? 'error.main'
                            : 'inherit'
                        }
                      >
                        #{index + 1}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {holding.stock}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">{holding.quantity}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(holding.total_invested)}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(holding.current_value)}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color:
                          holding.profit_loss >= 0 ? 'success.main' : 'error.main',
                        fontWeight: 'bold',
                      }}
                    >
                      {formatCurrency(holding.profit_loss)}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color:
                          holding.profit_loss_percentage >= 0
                            ? 'success.main'
                            : 'error.main',
                        fontWeight: 'bold',
                      }}
                    >
                      {formatPercentage(holding.profit_loss_percentage)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography color="textSecondary">
                      No holdings found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}