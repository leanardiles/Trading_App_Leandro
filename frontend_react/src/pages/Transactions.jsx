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
  MenuItem,
  Grid,
  Card,
  CardContent,
} from '@mui/material'
import { Add } from '@mui/icons-material'
import { transactionAPI } from '../services/api'
import { formatCurrency, formatDateTime } from '../utils/format'
import { toast } from 'react-toastify'

const TRANSACTION_TYPES = [
  { value: 'deposit', label: 'Deposit' },
  { value: 'withdrawal', label: 'Withdrawal' },
  { value: 'buy', label: 'Buy Stock' },
  { value: 'sell', label: 'Sell Stock' },
  { value: 'dividend', label: 'Dividend' },
  { value: 'fee', label: 'Fee' },
]

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [formData, setFormData] = useState({
    transaction_type: 'deposit',
    debit: '0.00',
    credit: '0.00',
    description: '',
  })

  useEffect(() => {
    loadTransactions()
  }, [])

  const loadTransactions = async () => {
    try {
      setLoading(true)
      const [transactionsRes, summaryRes] = await Promise.all([
        transactionAPI.list(),
        transactionAPI.summary(),
      ])

      setTransactions(
        transactionsRes.data.results || transactionsRes.data
      )
      setSummary(summaryRes.data)
    } catch (err) {
      setError('Failed to load transactions')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    // Validate description is not empty
    if (!formData.description || !formData.description.trim()) {
      toast.error('Description is required')
      return
    }
    
    const debit = parseFloat(formData.debit) || 0
    const credit = parseFloat(formData.credit) || 0
    
    // Validate based on transaction type
    if (formData.transaction_type === 'deposit') {
      if (credit <= 0) {
        toast.error('Credit amount must be greater than 0 for deposits')
        return
      }
      // For deposits, debit should be 0
      if (debit > 0) {
        toast.error('Debit should be 0 for deposits. Only enter credit amount.')
        return
      }
    } else if (formData.transaction_type === 'withdrawal') {
      if (debit <= 0) {
        toast.error('Debit amount must be greater than 0 for withdrawals')
        return
      }
      // For withdrawals, credit should be 0
      if (credit > 0) {
        toast.error('Credit should be 0 for withdrawals. Only enter debit amount.')
        return
      }
    } else {
      // For other transaction types, validate at least one amount is greater than 0
      if (debit === 0 && credit === 0) {
        toast.error('Either debit or credit amount must be greater than 0')
        return
      }
    }
    
    try {
      await transactionAPI.create({
        transaction_type: formData.transaction_type,
        debit: debit,
        credit: credit,
        description: formData.description.trim(),
      })
      toast.success('Transaction created successfully')
      setOpenDialog(false)
      setFormData({
        transaction_type: 'deposit',
        debit: '0.00',
        credit: '0.00',
        description: '',
      })
      loadTransactions()
    } catch (err) {
      const errorMsg = err.response?.data?.description?.[0] || 
                      err.response?.data?.error || 
                      err.response?.data?.detail || 
                      'Failed to create transaction'
      toast.error(errorMsg)
      console.error('Transaction creation error:', err.response?.data)
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
        <Typography variant="h4">Transactions</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          New Transaction
        </Button>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {summary && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="textSecondary">
                  Total Credits
                </Typography>
                <Typography variant="h6" color="success.main">
                  {formatCurrency(summary.total_credits)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="textSecondary">
                  Total Debits
                </Typography>
                <Typography variant="h6" color="error.main">
                  {formatCurrency(summary.total_debits)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="textSecondary">
                  Net Amount
                </Typography>
                <Typography variant="h6">
                  {formatCurrency(summary.net_amount)}
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
                <TableCell>Date</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Debit</TableCell>
                <TableCell align="right">Credit</TableCell>
                <TableCell align="right">Balance After</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {formatDateTime(transaction.date)}
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          textTransform: 'capitalize',
                          fontWeight: 'bold',
                        }}
                      >
                        {transaction.transaction_type}
                      </Typography>
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell align="right">
                      {transaction.debit > 0 && formatCurrency(transaction.debit)}
                    </TableCell>
                    <TableCell align="right">
                      {transaction.credit > 0 && (
                        <Typography color="success.main">
                          {formatCurrency(transaction.credit)}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(transaction.balance_after)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography color="textSecondary">
                      No transactions found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Transaction</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              select
              fullWidth
              label="Transaction Type"
              value={formData.transaction_type}
              onChange={(e) =>
                setFormData({ ...formData, transaction_type: e.target.value })
              }
              margin="normal"
            >
              {TRANSACTION_TYPES.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Debit Amount"
              type="number"
              value={formData.debit}
              onChange={(e) =>
                setFormData({ ...formData, debit: e.target.value })
              }
              margin="normal"
              disabled={formData.transaction_type === 'deposit'}
              helperText={formData.transaction_type === 'deposit' ? 'Not used for deposits' : ''}
            />
            <TextField
              fullWidth
              label="Credit Amount"
              type="number"
              value={formData.credit}
              onChange={(e) =>
                setFormData({ ...formData, credit: e.target.value })
              }
              margin="normal"
              disabled={formData.transaction_type === 'withdrawal'}
              helperText={formData.transaction_type === 'withdrawal' ? 'Not used for withdrawals' : ''}
            />
            <TextField
              fullWidth
              required
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              margin="normal"
              helperText="Description is required"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

