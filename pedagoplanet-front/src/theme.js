import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4caf50', 
    },
    secondary: {
      main: '#ff5722', 
    },
  },
  typography: {
    h1: {
      fontSize: '2.5rem',
      fontWeight: '500',
      fontFamily: 'Roboto, Arial, sans-serif',
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
    },
    h4: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
    },
    h5: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '1.7rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, 
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          padding: '16px',
          margin: '16px',
        },
      },
    },
  },
});

export default theme;
