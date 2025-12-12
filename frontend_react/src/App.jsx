import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Portfolio from './pages/Portfolio'
import Transactions from './pages/Transactions'
import Holdings from './pages/Holdings'
import Trading from './pages/Trading'
import MLStrategies from './pages/MLStrategies'
import Performance from './pages/Performance'
import Profile from './pages/Profile'

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  return isAuthenticated ? children : <Navigate to="/login" />
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" />
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/portfolio"
        element={
          <PrivateRoute>
            <Layout>
              <Portfolio />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <PrivateRoute>
            <Layout>
              <Transactions />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/holdings"
        element={
          <PrivateRoute>
            <Layout>
              <Holdings />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/trading"
        element={
          <PrivateRoute>
            <Layout>
              <Trading />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/ml-strategies"
        element={
          <PrivateRoute>
            <Layout>
              <MLStrategies />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/performance"
        element={
          <PrivateRoute>
            <Layout>
              <Performance />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Layout>
              <Profile />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  )
}

export default App

