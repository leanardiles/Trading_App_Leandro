import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Chip,
  Divider,
} from '@mui/material'
import {
  TrendingUp,
  Psychology,
  Search,
  Assessment,
} from '@mui/icons-material'
import { mlAPI } from '../services/api'
import { formatCurrency } from '../utils/format'
import { toast } from 'react-toastify'

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export default function MLStrategies() {
  const [activeTab, setActiveTab] = useState(0)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState({})

  // Pivot Point Analysis
  const [pivotData, setPivotData] = useState({
    high: '',
    low: '',
    close: '',
  })

  // Next Day Prediction
  const [predictionData, setPredictionData] = useState({
    stock_symbol: '',
    open_price: '',
    high: '',
    low: '',
    close: '',
    volume: '',
  })

  // Stock Screener
  const [screenerData, setScreenerData] = useState({
    market_cap: '',
    volume: '',
    sector: 'Technology',
  })

  // Index Rebalancing
  const [indexData, setIndexData] = useState({
    stock_symbol: '',
    event_type: 'ADD',
    announcement_date: '',
    effective_date: '',
    current_price: '',
    index_name: 'SP500',
  })

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
    setResults({})
  }

  const handlePivotAnalysis = async () => {
    if (!pivotData.high || !pivotData.low || !pivotData.close) {
      toast.error('Please fill in all fields')
      return
    }
    setLoading(true)
    try {
      const response = await mlAPI.pivotAnalysis({
        high: parseFloat(pivotData.high),
        low: parseFloat(pivotData.low),
        close: parseFloat(pivotData.close),
      })
      setResults({ pivot: response.data })
      toast.success('Analysis complete')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  const handlePrediction = async () => {
    if (!predictionData.stock_symbol || !predictionData.open_price) {
      toast.error('Please fill in required fields')
      return
    }
    setLoading(true)
    try {
      const response = await mlAPI.nextDayPrediction({
        stock_symbol: predictionData.stock_symbol,
        open_price: parseFloat(predictionData.open_price),
        high: parseFloat(predictionData.high),
        low: parseFloat(predictionData.low),
        close: parseFloat(predictionData.close),
        volume: parseInt(predictionData.volume),
      })
      setResults({ prediction: response.data })
      toast.success('Prediction generated')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Prediction failed')
    } finally {
      setLoading(false)
    }
  }

  const handleScreener = async () => {
    if (!screenerData.market_cap || !screenerData.volume) {
      toast.error('Please fill in market cap and volume')
      return
    }
    setLoading(true)
    try {
      const response = await mlAPI.stockScreener({
        market_cap: parseFloat(screenerData.market_cap),
        volume: parseInt(screenerData.volume),
        sector: screenerData.sector,
      })
      setResults({ screener: response.data })
      toast.success('Screening complete')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Screening failed')
    } finally {
      setLoading(false)
    }
  }

  const handleIndexAnalysis = async () => {
    if (!indexData.stock_symbol || !indexData.announcement_date || !indexData.effective_date) {
      toast.error('Please fill in all required fields')
      return
    }
    setLoading(true)
    try {
      const response = await mlAPI.indexRebalancing({
        stock_symbol: indexData.stock_symbol,
        event_type: indexData.event_type,
        announcement_date: indexData.announcement_date,
        effective_date: indexData.effective_date,
        current_price: parseFloat(indexData.current_price),
        index_name: indexData.index_name,
      })
      setResults({ index: response.data })
      toast.success('Analysis complete')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        ML Trading Strategies
      </Typography>

      <Paper sx={{ mt: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          <Tab icon={<TrendingUp />} iconPosition="start" label="Pivot Point Analysis" />
          <Tab icon={<Psychology />} iconPosition="start" label="Next-Day Prediction" />
          <Tab icon={<Search />} iconPosition="start" label="Stock Screener" />
          <Tab icon={<Assessment />} iconPosition="start" label="Index Rebalancing" />
        </Tabs>

        {/* Pivot Point Analysis Tab */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Pivot Point Analysis
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    Calculate pivot points and generate trading signals based on support and resistance levels.
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      label="High Price"
                      type="number"
                      value={pivotData.high}
                      onChange={(e) =>
                        setPivotData({ ...pivotData, high: e.target.value })
                      }
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Low Price"
                      type="number"
                      value={pivotData.low}
                      onChange={(e) =>
                        setPivotData({ ...pivotData, low: e.target.value })
                      }
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Close Price"
                      type="number"
                      value={pivotData.close}
                      onChange={(e) =>
                        setPivotData({ ...pivotData, close: e.target.value })
                      }
                      margin="normal"
                    />
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handlePivotAnalysis}
                      disabled={loading}
                      sx={{ mt: 2 }}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Analyze'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              {results.pivot && (
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Analysis Results
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Chip
                        label={results.pivot.signal}
                        color={
                          results.pivot.signal.includes('BUY')
                            ? 'success'
                            : results.pivot.signal.includes('SELL')
                            ? 'error'
                            : 'default'
                        }
                        sx={{ mb: 2 }}
                      />
                      <Typography variant="body2" paragraph>
                        {results.pivot.description}
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" gutterBottom>
                        Pivot Points:
                      </Typography>
                      {results.pivot.pivot_points && (
                        <Box>
                          <Typography variant="body2">
                            Pivot: {formatCurrency(results.pivot.pivot_points.pivot_point)}
                          </Typography>
                          <Typography variant="body2">
                            S1: {formatCurrency(results.pivot.pivot_points.support_1)} | S2:{' '}
                            {formatCurrency(results.pivot.pivot_points.support_2)}
                          </Typography>
                          <Typography variant="body2">
                            R1: {formatCurrency(results.pivot.pivot_points.resistance_1)} | R2:{' '}
                            {formatCurrency(results.pivot.pivot_points.resistance_2)}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Grid>
          </Grid>
        </TabPanel>

        {/* Next-Day Prediction Tab */}
        <TabPanel value={activeTab} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Next-Day Price Prediction
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    Predict the next day's price movement direction using ML models.
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      label="Stock Symbol"
                      value={predictionData.stock_symbol}
                      onChange={(e) =>
                        setPredictionData({ ...predictionData, stock_symbol: e.target.value })
                      }
                      margin="normal"
                      placeholder="e.g., AAPL"
                    />
                    <TextField
                      fullWidth
                      label="Open Price"
                      type="number"
                      value={predictionData.open_price}
                      onChange={(e) =>
                        setPredictionData({ ...predictionData, open_price: e.target.value })
                      }
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="High Price"
                      type="number"
                      value={predictionData.high}
                      onChange={(e) =>
                        setPredictionData({ ...predictionData, high: e.target.value })
                      }
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Low Price"
                      type="number"
                      value={predictionData.low}
                      onChange={(e) =>
                        setPredictionData({ ...predictionData, low: e.target.value })
                      }
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Close Price"
                      type="number"
                      value={predictionData.close}
                      onChange={(e) =>
                        setPredictionData({ ...predictionData, close: e.target.value })
                      }
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Volume"
                      type="number"
                      value={predictionData.volume}
                      onChange={(e) =>
                        setPredictionData({ ...predictionData, volume: e.target.value })
                      }
                      margin="normal"
                    />
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handlePrediction}
                      disabled={loading}
                      sx={{ mt: 2 }}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Predict'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              {results.prediction && (
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Prediction Results
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Chip
                        label={results.prediction.prediction}
                        color={
                          results.prediction.prediction === 'UP'
                            ? 'success'
                            : results.prediction.prediction === 'DOWN'
                            ? 'error'
                            : 'default'
                        }
                        sx={{ mb: 2 }}
                      />
                      <Typography variant="body1" paragraph>
                        {results.prediction.recommendation}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Confidence: {results.prediction.confidence}%
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Price Change Today: {results.prediction.price_change_today}%
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Volatility: {results.prediction.volatility}%
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Grid>
          </Grid>
        </TabPanel>

        {/* Stock Screener Tab */}
        <TabPanel value={activeTab} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Stock Screener
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    Screen stocks for potential index addition based on market cap, volume, and sector.
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      label="Market Cap"
                      type="number"
                      value={screenerData.market_cap}
                      onChange={(e) =>
                        setScreenerData({ ...screenerData, market_cap: e.target.value })
                      }
                      margin="normal"
                      placeholder="e.g., 15000000000"
                      helperText="Enter market cap in USD"
                    />
                    <TextField
                      fullWidth
                      label="Daily Volume"
                      type="number"
                      value={screenerData.volume}
                      onChange={(e) =>
                        setScreenerData({ ...screenerData, volume: e.target.value })
                      }
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Sector"
                      select
                      value={screenerData.sector}
                      onChange={(e) =>
                        setScreenerData({ ...screenerData, sector: e.target.value })
                      }
                      margin="normal"
                    >
                      <option value="Technology">Technology</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Finance">Finance</option>
                      <option value="Energy">Energy</option>
                      <option value="Consumer">Consumer</option>
                    </TextField>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleScreener}
                      disabled={loading}
                      sx={{ mt: 2 }}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Screen Stock'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              {results.screener && (
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Screening Results
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Chip
                        label={results.screener.recommendation}
                        color={
                          results.screener.recommendation === 'STRONG_CANDIDATE'
                            ? 'success'
                            : results.screener.recommendation === 'POTENTIAL_CANDIDATE'
                            ? 'warning'
                            : 'default'
                        }
                        sx={{ mb: 2 }}
                      />
                      <Typography variant="h6" gutterBottom>
                        Score: {results.screener.score}/100
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" gutterBottom>
                        Reasons:
                      </Typography>
                      {results.screener.reasons?.map((reason, index) => (
                        <Typography key={index} variant="body2" paragraph>
                          {reason}
                        </Typography>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Grid>
          </Grid>
        </TabPanel>

        {/* Index Rebalancing Tab */}
        <TabPanel value={activeTab} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Index Rebalancing Strategy
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    Analyze index reconstitution events and get trading recommendations.
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      label="Stock Symbol"
                      value={indexData.stock_symbol}
                      onChange={(e) =>
                        setIndexData({ ...indexData, stock_symbol: e.target.value })
                      }
                      margin="normal"
                      placeholder="e.g., AAPL"
                    />
                    <TextField
                      fullWidth
                      select
                      label="Event Type"
                      value={indexData.event_type}
                      onChange={(e) =>
                        setIndexData({ ...indexData, event_type: e.target.value })
                      }
                      margin="normal"
                    >
                      <option value="ADD">Add to Index</option>
                      <option value="DELETE">Remove from Index</option>
                    </TextField>
                    <TextField
                      fullWidth
                      label="Announcement Date"
                      type="date"
                      value={indexData.announcement_date}
                      onChange={(e) =>
                        setIndexData({ ...indexData, announcement_date: e.target.value })
                      }
                      margin="normal"
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      fullWidth
                      label="Effective Date"
                      type="date"
                      value={indexData.effective_date}
                      onChange={(e) =>
                        setIndexData({ ...indexData, effective_date: e.target.value })
                      }
                      margin="normal"
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      fullWidth
                      label="Current Price"
                      type="number"
                      value={indexData.current_price}
                      onChange={(e) =>
                        setIndexData({ ...indexData, current_price: e.target.value })
                      }
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Index Name"
                      value={indexData.index_name}
                      onChange={(e) =>
                        setIndexData({ ...indexData, index_name: e.target.value })
                      }
                      margin="normal"
                    />
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleIndexAnalysis}
                      disabled={loading}
                      sx={{ mt: 2 }}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Analyze Event'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              {results.index && (
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Analysis Results
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Chip
                        label={results.index.action}
                        color={
                          results.index.action.includes('BUY')
                            ? 'success'
                            : results.index.action.includes('SHORT') || results.index.action === 'SELL'
                            ? 'error'
                            : 'default'
                        }
                        sx={{ mb: 2 }}
                      />
                      <Typography variant="body1" paragraph fontWeight="bold">
                        {results.index.rationale}
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="body2">
                        <strong>Stock:</strong> {results.index.stock_symbol}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Index:</strong> {results.index.index}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Event Type:</strong> {results.index.event_type}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Current Price:</strong>{' '}
                        {formatCurrency(results.index.current_price)}
                      </Typography>
                      {results.index.target_price && (
                        <Typography variant="body2">
                          <strong>Target Price:</strong>{' '}
                          {formatCurrency(results.index.target_price)}
                        </Typography>
                      )}
                      <Typography variant="body2">
                        <strong>Expected Return:</strong>{' '}
                        {results.index.expected_return_pct}%
                      </Typography>
                      <Typography variant="body2">
                        <strong>Days to Effective:</strong> {results.index.days_to_effective}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Position Size:</strong> {results.index.position_size_pct}%
                      </Typography>
                      <Typography variant="body2">
                        <strong>Risk Rating:</strong> {results.index.risk_rating}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Box>
  )
}

