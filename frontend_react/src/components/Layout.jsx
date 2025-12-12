import React, { useState } from 'react'
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
  TrendingUp,
  ShowChart,
  Psychology,
  Assessment,
  Logout,
  Person,
  ShoppingCart,
} from '@mui/icons-material'
import { useAuth } from '../contexts/AuthContext'

const drawerWidth = 240

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Portfolio', icon: <AccountBalance />, path: '/portfolio' },
  { text: 'Trading', icon: <ShoppingCart />, path: '/trading' },
  { text: 'Transactions', icon: <ShowChart />, path: '/transactions' },
  { text: 'Holdings', icon: <TrendingUp />, path: '/holdings' },
  { text: 'ML Strategies', icon: <Psychology />, path: '/ml-strategies' },
  { text: 'Performance', icon: <Assessment />, path: '/performance' },
]

export default function Layout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)

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
      <Toolbar sx={{ bgcolor: '#0c0f27', color: '#febc4c' }}>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
          Trading Platform
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? '#febc4c' : '#ffffff' }}>
                {item.icon}
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
          bgcolor: '#0c0f27', // Blue background
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
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: '#febc4c', fontWeight: 'bold' }}>
            Index Rebalancing Trading Platform
          </Typography>
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
          bgcolor: '#0c0f27', // Blue background
          color: '#ffffff', // White text
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  )
}

