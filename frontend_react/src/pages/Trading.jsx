import React, { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress,
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
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
} from '@mui/icons-material'
import { tradingAPI, portfolioAPI, holdingAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { formatCurrency } from '../utils/format'
import { toast } from 'react-toastify'

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export default function Trading() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState(0)
  const [loading, setLoading] = useState(false)
  const [portfolioSummary, setPortfolioSummary] = useState(null)
  const [holdings, setHoldings] = useState([])
  const [refreshKey, setRefreshKey] = useState(0)

  // Buy form data
  const [buyData, setBuyData] = useState({
    stock: '',
    quantity: '',
    price: '',
  })

  // Sell form data
  const [sellData, setSellData] = useState({
    stock: '',
    quantity: '',
    price: '',
  })

  useEffect(() => {
    loadData()
  }, [refreshKey])

  const loadData = async () => {
    try {
      const [portfolioRes, holdingsRes] = await Promise.all([
        portfolioAPI.summary(),
        holdingAPI.list(),
      ])
      setPortfolioSummary(portfolioRes.data)
      setHoldings(holdingsRes.data.results || holdingsRes.data)
    } catch (err) {
      console.error('Failed to load data:', err)
    }
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const handleBuy = async () => {
    if (!buyData.stock || !buyData.quantity || !buyData.price) {
      toast.error('Please fill in all fields')
      return
    }

    const quantity = parseInt(buyData.quantity)
    const price = parseFloat(buyData.price)

    if (quantity <= 0 || price <= 0) {
      toast.error('Quantity and price must be greater than 0')
      return
    }

    setLoading(true)
    try {
      const response = await tradingAPI.buy({
        stock: buyData.stock.toUpperCase(),
        quantity: quantity,
        price: price,
      })

      toast.success(response.data.message)
      setBuyData({ stock: '', quantity: '', price: '' })
      setRefreshKey((prev) => prev + 1)
      
      // Update user balance in context
      if (user) {
        user.balance = response.data.new_balance
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to buy stock'
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleSell = async () => {
    if (!sellData.stock || !sellData.quantity || !sellData.price) {
      toast.error('Please fill in all fields')
      return
    }

    const quantity = parseInt(sellData.quantity)
    const price = parseFloat(sellData.price)

    if (quantity <= 0 || price <= 0) {
      toast.error('Quantity and price must be greater than 0')
      return
    }

    setLoading(true)
    try {
      const response = await tradingAPI.sell({
        stock: sellData.stock.toUpperCase(),
        quantity: quantity,
        price: price,
      })

      toast.success(response.data.message)
      setSellData({ stock: '', quantity: '', price: '' })
      setRefreshKey((prev) => prev + 1)
      
      // Update user balance in context
      if (user) {
        user.balance = response.data.new_balance
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to sell stock'
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const fillSellFromHolding = (holding) => {
    setSellData({
      stock: holding.stock,
      quantity: holding.quantity.toString(),
      price: holding.current_price.toString(),
    })
    setActiveTab(1) // Switch to sell tab
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Trading
      </Typography>

      {/* Portfolio Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <AccountBalance color="primary" />
                <Typography variant="body2" color="textSecondary">
                  Available Balance
                </Typography>
              </Box>
              <Typography variant="h5" fontWeight="bold">
                {formatCurrency(portfolioSummary?.total_balance || user?.balance || 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <TrendingUp color="success" />
                <Typography variant="body2" color="textSecondary">
                  Total Invested
                </Typography>
              </Box>
              <Typography variant="h5" fontWeight="bold">
                {formatCurrency(portfolioSummary?.total_invested || 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <TrendingDown color="error" />
                <Typography variant="body2" color="textSecondary">
                  Current Value
                </Typography>
              </Box>
              <Typography variant="h5" fontWeight="bold">
                {formatCurrency(portfolioSummary?.total_current_value || 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper>
        <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
          <Tab icon={<TrendingUp />} iconPosition="start" label="Buy Stock" />
          <Tab icon={<TrendingDown />} iconPosition="start" label="Sell Stock" />
        </Tabs>

        {/* Buy Tab */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Buy Stock
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    Enter the stock symbol, quantity, and current market price to purchase shares.
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      label="Stock Symbol"
                      value={buyData.stock}
                      onChange={(e) =>
                        setBuyData({ ...buyData, stock: e.target.value })
                      }
                      margin="normal"
                      placeholder="e.g., AAPL"
                      inputProps={{ style: { textTransform: 'uppercase' } }}
                    />
                    <TextField
                      fullWidth
                      label="Quantity"
                      type="number"
                      value={buyData.quantity}
                      onChange={(e) =>
                        setBuyData({ ...buyData, quantity: e.target.value })
                      }
                      margin="normal"
                      inputProps={{ min: 1 }}
                    />
                    <TextField
                      fullWidth
                      label="Price per Share"
                      type="number"
                      value={buyData.price}
                      onChange={(e) =>
                        setBuyData({ ...buyData, price: e.target.value })
                      }
                      margin="normal"
                      inputProps={{ min: 0.01, step: 0.01 }}
                    />
                    {buyData.quantity && buyData.price && (
                      <Alert severity="info" sx={{ mt: 2 }}>
                        Total Cost:{' '}
                        {formatCurrency(
                          parseFloat(buyData.quantity || 0) *
                            parseFloat(buyData.price || 0)
                        )}
                      </Alert>
                    )}
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleBuy}
                      disabled={loading}
                      sx={{ mt: 2 }}
                      color="success"
                      startIcon={<TrendingUp />}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Buy Stock'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Your Holdings
                  </Typography>
                  {holdings.length > 0 ? (
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Stock</TableCell>
                            <TableCell align="right">Qty</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="right">Value</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {holdings.map((holding) => (
                            <TableRow key={holding.id}>
                              <TableCell>
                                <Typography variant="subtitle2" fontWeight="bold">
                                  {holding.stock}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                {holding.quantity}
                              </TableCell>
                              <TableCell align="right">
                                {formatCurrency(holding.current_price)}
                              </TableCell>
                              <TableCell align="right">
                                {formatCurrency(holding.current_value)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No holdings yet. Buy your first stock!
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Sell Tab */}
        <TabPanel value={activeTab} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Sell Stock
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    Enter the stock symbol, quantity to sell, and current market price.
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      label="Stock Symbol"
                      value={sellData.stock}
                      onChange={(e) =>
                        setSellData({ ...sellData, stock: e.target.value })
                      }
                      margin="normal"
                      placeholder="e.g., AAPL"
                      inputProps={{ style: { textTransform: 'uppercase' } }}
                    />
                    <TextField
                      fullWidth
                      label="Quantity to Sell"
                      type="number"
                      value={sellData.quantity}
                      onChange={(e) =>
                        setSellData({ ...sellData, quantity: e.target.value })
                      }
                      margin="normal"
                      inputProps={{ min: 1 }}
                    />
                    <TextField
                      fullWidth
                      label="Price per Share"
                      type="number"
                      value={sellData.price}
                      onChange={(e) =>
                        setSellData({ ...sellData, price: e.target.value })
                      }
                      margin="normal"
                      inputProps={{ min: 0.01, step: 0.01 }}
                    />
                    {sellData.quantity && sellData.price && (
                      <Alert severity="info" sx={{ mt: 2 }}>
                        Total Proceeds:{' '}
                        {formatCurrency(
                          parseFloat(sellData.quantity || 0) *
                            parseFloat(sellData.price || 0)
                        )}
                      </Alert>
                    )}
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleSell}
                      disabled={loading}
                      sx={{ mt: 2 }}
                      color="error"
                      startIcon={<TrendingDown />}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Sell Stock'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Available Holdings
                  </Typography>
                  {holdings.length > 0 ? (
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Stock</TableCell>
                            <TableCell align="right">Qty</TableCell>
                            <TableCell align="right">Buy Price</TableCell>
                            <TableCell align="right">Current</TableCell>
                            <TableCell align="center">Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {holdings.map((holding) => (
                            <TableRow key={holding.id}>
                              <TableCell>
                                <Typography variant="subtitle2" fontWeight="bold">
                                  {holding.stock}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                {holding.quantity}
                              </TableCell>
                              <TableCell align="right">
                                {formatCurrency(holding.buying_price)}
                              </TableCell>
                              <TableCell align="right">
                                <Chip
                                  label={formatCurrency(holding.current_price)}
                                  color={
                                    holding.current_price >= holding.buying_price
                                      ? 'success'
                                      : 'error'
                                  }
                                  size="small"
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() => fillSellFromHolding(holding)}
                                >
                                  Use
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No holdings to sell.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Box>
  )
}

