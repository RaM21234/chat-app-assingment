import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#34699A', // A mid-tone blue for primary actions
    },
    secondary: {
      main: '#58A0C8', // A lighter blue for secondary elements
    },
    background: {
      default: '#FDF5AA', // A light yellow for the main background
      paper: '#FFFFFF', // White for component backgrounds
    },
    text: {
      primary: '#113F67', // Dark blue for main text
      secondary: 'rgba(17, 63, 103, 0.7)', // Slightly lighter for secondary text
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#113F67', // Darkest blue for app bar
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiBox: {
      styleOverrides: {
        root: {
          // You can add global box styles here if needed
        },
      },
    },
  },
});

export default theme;
