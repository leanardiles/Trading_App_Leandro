import React, { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  Chip,
} from '@mui/material'
import { Add } from '@mui/icons-material'
import { holdingAPI } from '../services/api'
import { formatCurrency, formatPercentage } from '../utils/format'
import { toast } from 'react-toastify'

export default function Holdings() {
  const [holdings, setHoldings] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [formData, setFormData] = useState({
    stock: '',
    quantity: '',
    buying_price: '',
    current_price: '',
  })

  useEffect(() => {
    loadHoldings()
  }, [])

  const loadHoldings = async () => {
    try {
      setLoading(true)
      const [holdingsRes, summaryRes] = await Promise.all([
        holdingAPI.list(),
        holdingAPI.summary(),
      ])

      setHoldings(holdingsRes.data.results || holdingsRes.data)
      setSummary(summaryRes.data)
    } catch (err) {
      setError('Failed to load holdings')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    try {
      await holdingAPI.create({
        ...formData,
        quantity: parseInt(formData.quantity),
        buying_price: parseFloat(formData.buying_price),
        current_price: parseFloat(formData.current_price),
      })
      toast.success('Holding created successfully')
      setOpenDialog(false)
      setFormData({
        stock: '',
        quantity: '',
        buying_price: '',
        current_price: '',
      })
      loadHoldings()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to create holding')
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Holdings</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          Add Holding
        </Button>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {summary && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="textSecondary">
                  Total Invested
                </Typography>
                <Typography variant="h6">
                  {formatCurrency(summary.total_invested)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="textSecondary">
                  Current Value
                </Typography>
                <Typography variant="h6">
                  {formatCurrency(summary.total_current_value)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="textSecondary">
                  Total P/L
                </Typography>
                <Typography
                  variant="h6"
                  color={
                    summary.total_profit_loss >= 0 ? 'success.main' : 'error.main'
                  }
                >
                  {formatCurrency(summary.total_profit_loss)} (
                  {formatPercentage(summary.total_profit_loss_percentage)})
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Stock</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Buying Price</TableCell>
                <TableCell align="right">Current Price</TableCell>
                <TableCell align="right">Invested</TableCell>
                <TableCell align="right">Current Value</TableCell>
                <TableCell align="right">P/L</TableCell>
                <TableCell align="right">P/L %</TableCell>
                <TableCell align="center">Status</TableCell>
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
                    <TableCell align="center">
                      <Chip
                        label={holding.profit_loss >= 0 ? 'Profit' : 'Loss'}
                        color={holding.profit_loss >= 0 ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Typography color="textSecondary">No holdings found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Holding</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Stock Symbol"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              margin="normal"
              placeholder="e.g., AAPL"
            />
            <TextField
              fullWidth
              label="Quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Buying Price"
              type="number"
              value={formData.buying_price}
              onChange={(e) =>
                setFormData({ ...formData, buying_price: e.target.value })
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Current Price"
              type="number"
              value={formData.current_price}
              onChange={(e) =>
                setFormData({ ...formData, current_price: e.target.value })
              }
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

