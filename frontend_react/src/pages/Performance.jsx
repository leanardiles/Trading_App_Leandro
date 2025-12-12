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
} from '@mui/material'
import { portfolioAPI, holdingAPI } from '../services/api'
import { formatCurrency, formatPercentage } from '../utils/format'

export default function Performance() {
  const [performance, setPerformance] = useState(null)
  const [holdings, setHoldings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadPerformanceData()
  }, [])

  const loadPerformanceData = async () => {
    try {
      setLoading(true)
      const [performanceRes, holdingsRes] = await Promise.all([
        portfolioAPI.performance(),
        holdingAPI.list(),
      ])

      setPerformance(performanceRes.data)
      setHoldings(holdingsRes.data.results || holdingsRes.data)
    } catch (err) {
      setError('Failed to load performance data')
      console.error(err)
    } finally {
      setLoading(false)
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

      {performance?.all_performances && performance.all_performances.length > 0 && (
        <Paper sx={{ mt: 3, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            All Stock Performances
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {performance.all_performances.map((perf, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {perf.stock}
                    </Typography>
                    <Typography
                      variant="h6"
                      color={perf.profit_loss_percentage >= 0 ? 'success.main' : 'error.main'}
                    >
                      {formatPercentage(perf.profit_loss_percentage)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {formatCurrency(perf.profit_loss)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}
    </Box>
  )
}

