import { createTheme } from '@mui/material/styles'

// Custom color palette
const colors = {
  yellow: '#febc4c',
  blue: '#0c0f27',
  white: '#ffffff',
}

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: colors.yellow, // Yellow for primary actions and highlights
      contrastText: colors.blue, // Blue text on yellow buttons
    },
    secondary: {
      main: colors.yellow, // Yellow for secondary elements
      contrastText: colors.blue,
    },
    background: {
      default: colors.blue, // Blue background
      paper: '#15182e', // Slightly lighter blue for cards/paper
    },
    text: {
      primary: colors.white, // White text
      secondary: colors.yellow, // Yellow for secondary text
    },
    success: {
      main: '#4caf50',
      contrastText: colors.white,
    },
    error: {
      main: '#f44336',
      contrastText: colors.white,
    },
    warning: {
      main: colors.yellow,
      contrastText: colors.blue,
    },
    info: {
      main: '#2196f3',
      contrastText: colors.white,
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    allVariants: {
      color: colors.white, // All text is white by default
    },
    h1: {
      color: colors.white,
    },
    h2: {
      color: colors.white,
    },
    h3: {
      color: colors.white,
    },
    h4: {
      color: colors.white,
    },
    h5: {
      color: colors.white,
    },
    h6: {
      color: colors.white,
    },
    body1: {
      color: colors.white,
    },
    body2: {
      color: colors.white,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.blue,
          color: colors.white,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: colors.blue,
          color: colors.white,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#15182e', // Slightly lighter blue for cards
          color: colors.white,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#15182e', // Slightly lighter blue for paper
          color: colors.white,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Keep button text as-is
        },
        containedPrimary: {
          backgroundColor: colors.yellow,
          color: colors.blue,
          '&:hover': {
            backgroundColor: '#ffc966', // Lighter yellow on hover
          },
        },
        containedSecondary: {
          backgroundColor: colors.yellow,
          color: colors.blue,
          '&:hover': {
            backgroundColor: '#ffc966',
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          color: colors.white,
          '&.Mui-selected': {
            backgroundColor: '#15182e',
            color: colors.yellow,
            '&:hover': {
              backgroundColor: '#1a1f35',
            },
          },
          '&:hover': {
            backgroundColor: '#15182e',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': {
            color: colors.white,
          },
          '& .MuiInputLabel-root': {
            color: colors.white,
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: colors.yellow,
            },
            '&:hover fieldset': {
              borderColor: colors.yellow,
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.yellow,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          color: colors.white,
        },
      },
    },
  },
})

export default theme

