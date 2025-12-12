import React, { useState, useEffect } from 'react'
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
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

export default function Portfolio() {
  const [portfolioSummary, setPortfolioSummary] = useState(null)
  const [performance, setPerformance] = useState(null)
  const [holdings, setHoldings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadPortfolioData()
  }, [])

  const loadPortfolioData = async () => {
    try {
      setLoading(true)
      const [summaryRes, performanceRes, holdingsRes] = await Promise.all([
        portfolioAPI.summary(),
        portfolioAPI.performance(),
        holdingAPI.list(),
      ])

      setPortfolioSummary(summaryRes.data)
      setPerformance(performanceRes.data)
      setHoldings(holdingsRes.data.results || holdingsRes.data)
    } catch (err) {
      setError('Failed to load portfolio data')
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

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Portfolio Overview
      </Typography>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Portfolio Summary
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography>Total Balance:</Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {formatCurrency(portfolioSummary?.total_balance || 0)}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography>Total Invested:</Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {formatCurrency(portfolioSummary?.total_invested || 0)}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography>Current Value:</Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {formatCurrency(portfolioSummary?.total_current_value || 0)}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography>Total P/L:</Typography>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color={
                      (portfolioSummary?.total_profit_loss || 0) >= 0
                        ? 'success.main'
                        : 'error.main'
                    }
                  >
                    {formatCurrency(portfolioSummary?.total_profit_loss || 0)}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Typography>P/L Percentage:</Typography>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color={
                      (portfolioSummary?.total_profit_loss_percentage || 0) >= 0
                        ? 'success.main'
                        : 'error.main'
                    }
                  >
                    {formatPercentage(
                      portfolioSummary?.total_profit_loss_percentage || 0
                    )}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance Metrics
              </Typography>
              {performance && (
                <Box sx={{ mt: 2 }}>
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography>Total Return:</Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {formatCurrency(performance.total_return || 0)}
                    </Typography>
                  </Box>
                  {performance.best_performer && (
                    <Box mb={2}>
                      <Typography variant="body2" color="textSecondary">
                        Best Performer:
                      </Typography>
                      <Typography fontWeight="bold">
                        {performance.best_performer.stock} (
                        {formatPercentage(performance.best_performer.profit_loss_percentage)})
                      </Typography>
                    </Box>
                  )}
                  {performance.worst_performer && (
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        Worst Performer:
                      </Typography>
                      <Typography fontWeight="bold">
                        {performance.worst_performer.stock} (
                        {formatPercentage(performance.worst_performer.profit_loss_percentage)})
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ mt: 3, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Holdings ({holdings.length})
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Stock</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Buying Price</TableCell>
                <TableCell align="right">Current Price</TableCell>
                <TableCell align="right">Total Invested</TableCell>
                <TableCell align="right">Current Value</TableCell>
                <TableCell align="right">P/L</TableCell>
                <TableCell align="right">P/L %</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {holdings.length > 0 ? (
                holdings.map((holding) => (
                  <TableRow key={holding.id}>
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {holding.stock}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">{holding.quantity}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(holding.buying_price)}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(holding.current_price)}
                    </TableCell>
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
                  <TableCell colSpan={8} align="center">
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

