import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Dashboard,
  AccountBalance,
  BusinessCenter,
  Assessment,
  ShoppingCart,
  ShowChart,
  Psychology,
  Notifications,
  SmartToy,
  Logout,
  Person,
  Badge,
} from '@mui/icons-material'
import { useAuth } from '../contexts/AuthContext'
import { signalAPI } from '../services/api'

const drawerWidth = 240

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Portfolio', icon: <AccountBalance />, path: '/portfolio' },
  { text: 'Holdings', icon: <BusinessCenter />, path: '/holdings' },
  { text: 'Performance', icon: <Assessment />, path: '/performance' },
  { text: 'Trading', icon: <ShoppingCart />, path: '/trading' },
  { text: 'Transactions', icon: <ShowChart />, path: '/transactions' },
  { text: 'Signals', icon: <Notifications />, path: '/signals' },
  { text: 'Hermes Agent', icon: <SmartToy />, path: '/hermes-agent' },
  { text: 'ML Strategies', icon: <Psychology />, path: '/ml-strategies' },
]

export default function Layout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [unreadSignals, setUnreadSignals] = useState(0)

  // Fetch unread signals count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await signalAPI.unreadCount()
        setUnreadSignals(response.data.unread_count)
      } catch (err) {
        console.error('Failed to fetch unread signals:', err)
      }
    }
    fetchUnreadCount()
    
    // Refresh every 60 seconds
    const interval = setInterval(fetchUnreadCount, 60000)
    return () => clearInterval(interval)
  }, [])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
    handleMenuClose()
  }

  const drawer = (
    <Box>
      <Toolbar sx={{ bgcolor: '#0c0f27', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img 
          src="/hermes_logo.png" 
          alt="Hermes Trading Logo" 
          style={{ 
            height: '60px', 
            width: 'auto',
            objectFit: 'contain'
          }} 
        />
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? '#febc4c' : '#ffffff' }}>
                {item.text === 'Signals' ? (
                  <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Notifications />
                    {unreadSignals > 0 && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -4,
                          right: -8,
                          backgroundColor: '#d32f2f',
                          borderRadius: '50%',
                          minWidth: '18px',
                          height: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.7rem',
                          fontWeight: 'bold',
                          color: '#fff',
                          padding: '0 4px',
                        }}
                      >
                        {unreadSignals}
                      </Box>
                    )}
                  </Box>
                ) : (
                  item.icon
                )}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                sx={{ 
                  color: location.pathname === item.path ? '#febc4c' : '#ffffff',
                  '& .MuiTypography-root': {
                    fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: '#0c0f27',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <img 
              src="/hermes_logo.png" 
              alt="Hermes Trading Logo" 
              style={{ 
                height: '52px', 
                width: 'auto',
                objectFit: 'contain'
              }} 
            />
            <Typography variant="h6" noWrap component="div" sx={{ color: '#febc4c', fontWeight: 'bold' }}>
              Hermes Trading
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ color: '#ffffff' }}>
              {user?.name || user?.email}
            </Typography>
            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
              <Avatar sx={{ bgcolor: '#febc4c', color: '#0c0f27', fontWeight: 'bold' }}>
                {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  bgcolor: '#15182e',
                  color: '#ffffff',
                  '& .MuiMenuItem-root': {
                    color: '#ffffff',
                    '&:hover': {
                      bgcolor: '#1a1f35',
                    },
                  },
                },
              }}
            >
              <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
                <Person sx={{ mr: 1, color: '#febc4c' }} /> Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 1, color: '#febc4c' }} /> Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: '#0c0f27',
          color: '#ffffff',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  )
}
