import { createTheme } from '@mui/material/styles';

// American Red Cross Official Colors
const redCrossColors = {
  primary: {
    main: '#DC143C', // American Red Cross Red
    light: '#FF6B6B',
    dark: '#B71C1C',
    contrastText: '#FFFFFF'
  },
  secondary: {
    main: '#1B365D', // Navy Blue
    light: '#2C5282',
    dark: '#0F2027',
    contrastText: '#FFFFFF'
  },
  accent: {
    main: '#F7F7F7', // Light Gray
    light: '#FFFFFF',
    dark: '#E5E5E5',
    contrastText: '#1B365D'
  },
  background: {
    default: '#FAFAFA',
    paper: '#FFFFFF'
  },
  text: {
    primary: '#1B365D',
    secondary: '#4A5568',
    disabled: '#A0AEC0'
  },
  error: {
    main: '#E53E3E',
    light: '#FC8181',
    dark: '#C53030'
  },
  warning: {
    main: '#DD6B20',
    light: '#F6AD55',
    dark: '#C05621'
  },
  success: {
    main: '#38A169',
    light: '#68D391',
    dark: '#2F855A'
  },
  info: {
    main: '#3182CE',
    light: '#63B3ED',
    dark: '#2C5282'
  }
};

// Typography - Economist-inspired professional fonts
const typography = {
  fontFamily: [
    'Georgia',
    'Times New Roman',
    'serif'
  ].join(','),
  h1: {
    fontFamily: 'Georgia, serif',
    fontWeight: 700,
    fontSize: '2.5rem',
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
    color: redCrossColors.text.primary
  },
  h2: {
    fontFamily: 'Georgia, serif',
    fontWeight: 600,
    fontSize: '2rem',
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
    color: redCrossColors.text.primary
  },
  h3: {
    fontFamily: 'Georgia, serif',
    fontWeight: 600,
    fontSize: '1.5rem',
    lineHeight: 1.4,
    color: redCrossColors.text.primary
  },
  h4: {
    fontFamily: 'Georgia, serif',
    fontWeight: 500,
    fontSize: '1.25rem',
    lineHeight: 1.4,
    color: redCrossColors.text.primary
  },
  h5: {
    fontFamily: 'Georgia, serif',
    fontWeight: 500,
    fontSize: '1.125rem',
    lineHeight: 1.4,
    color: redCrossColors.text.primary
  },
  h6: {
    fontFamily: 'Georgia, serif',
    fontWeight: 500,
    fontSize: '1rem',
    lineHeight: 1.4,
    color: redCrossColors.text.primary
  },
  body1: {
    fontFamily: 'Georgia, serif',
    fontSize: '1rem',
    lineHeight: 1.6,
    color: redCrossColors.text.primary
  },
  body2: {
    fontFamily: 'Georgia, serif',
    fontSize: '0.875rem',
    lineHeight: 1.5,
    color: redCrossColors.text.secondary
  },
  caption: {
    fontFamily: 'Georgia, serif',
    fontSize: '0.75rem',
    lineHeight: 1.4,
    color: redCrossColors.text.secondary
  },
  button: {
    fontFamily: 'Georgia, serif',
    fontWeight: 500,
    textTransform: 'none',
    letterSpacing: '0.02em'
  }
};

// Create the theme
const redCrossTheme = createTheme({
  palette: redCrossColors,
  typography: typography,
  shape: {
    borderRadius: 4
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }
        },
        contained: {
          backgroundColor: redCrossColors.primary.main,
          color: redCrossColors.primary.contrastText,
          '&:hover': {
            backgroundColor: redCrossColors.primary.dark
          }
        },
        outlined: {
          borderColor: redCrossColors.primary.main,
          color: redCrossColors.primary.main,
          '&:hover': {
            backgroundColor: redCrossColors.primary.main,
            color: redCrossColors.primary.contrastText
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          border: `1px solid ${redCrossColors.accent.dark}`,
          '&:hover': {
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)'
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: redCrossColors.background.paper,
          border: `1px solid ${redCrossColors.accent.dark}`
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: redCrossColors.primary.main,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: redCrossColors.background.paper,
          borderRight: `1px solid ${redCrossColors.accent.dark}`
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          margin: '2px 8px',
          '&:hover': {
            backgroundColor: redCrossColors.accent.main
          },
          '&.Mui-selected': {
            backgroundColor: redCrossColors.primary.main,
            color: redCrossColors.primary.contrastText,
            '&:hover': {
              backgroundColor: redCrossColors.primary.dark
            }
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: redCrossColors.accent.main,
          color: redCrossColors.text.primary,
          border: `1px solid ${redCrossColors.accent.dark}`,
          '&.MuiChip-colorPrimary': {
            backgroundColor: redCrossColors.primary.main,
            color: redCrossColors.primary.contrastText
          }
        }
      }
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: `1px solid ${redCrossColors.accent.dark}`,
          '& .MuiDataGrid-cell': {
            borderBottom: `1px solid ${redCrossColors.accent.dark}`
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: redCrossColors.accent.main,
            borderBottom: `2px solid ${redCrossColors.primary.main}`
          }
        }
      }
    }
  }
});

export default redCrossTheme;
