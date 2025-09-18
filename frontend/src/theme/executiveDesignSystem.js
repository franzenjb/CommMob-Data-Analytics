/**
 * WORLD-CLASS RED CROSS EXECUTIVE DASHBOARD DESIGN SYSTEM
 * 
 * This design system creates a C-suite worthy interface that surpasses 
 * the quality of existing Red Cross dashboards. It handles 320,000+ records
 * with sophisticated visual hierarchy and executive-grade aesthetics.
 */

import { createTheme } from '@mui/material/styles';

// === EXECUTIVE COLOR PALETTE ===
// Inspired by Bloomberg Terminal, McKinsey dashboards, and Fortune 500 C-suite interfaces

const executiveColors = {
  // PRIMARY BRAND COLORS
  redCross: {
    crimson: '#DC143C',      // Official Red Cross Red
    deepCrimson: '#B71C1C',  // Darker variant for hierarchy
    lightCrimson: '#E57373', // Lighter for backgrounds
    bloodRed: '#8B0000'      // Ultra-deep for critical alerts
  },

  // EXECUTIVE NEUTRALS - Sophisticated grayscale palette
  neutrals: {
    charcoal: '#1A1D23',     // Primary text - sophisticated black
    slate: '#2D3748',        // Secondary text
    graphite: '#4A5568',     // Tertiary text
    silver: '#718096',       // Muted text
    platinum: '#A0AEC0',     // Disabled text
    pearl: '#E2E8F0',        // Light borders
    ivory: '#F7FAFC',        // Background tints
    white: '#FFFFFF'         // Pure white
  },

  // EXECUTIVE STATUS COLORS - Financial/consulting inspired
  status: {
    success: {
      primary: '#047857',    // Deep emerald - professional success
      light: '#D1FAE5',      // Subtle background
      accent: '#10B981'      // Medium emphasis
    },
    warning: {
      primary: '#B45309',    // Sophisticated amber
      light: '#FEF3C7',      // Subtle background  
      accent: '#F59E0B'      // Medium emphasis
    },
    error: {
      primary: '#B91C1C',    // Deep red - not competing with brand
      light: '#FEE2E2',      // Subtle background
      accent: '#EF4444'      // Medium emphasis
    },
    info: {
      primary: '#1E40AF',    // Executive blue
      light: '#DBEAFE',      // Subtle background
      accent: '#3B82F6'      // Medium emphasis
    }
  },

  // LIGHT THEME PALETTE
  light: {
    background: {
      primary: '#FFFFFF',
      secondary: '#F8FAFC',
      tertiary: '#F1F5F9',
      elevated: '#FFFFFF'
    },
    surface: {
      primary: '#FFFFFF',
      secondary: '#F8FAFC', 
      elevated: '#FFFFFF',
      overlay: 'rgba(0, 0, 0, 0.04)'
    },
    border: {
      primary: '#E2E8F0',
      secondary: '#CBD5E0',
      focus: '#DC143C'
    }
  },

  // DARK THEME PALETTE - Premium dark mode
  dark: {
    background: {
      primary: '#0F172A',     // Deep navy - sophisticated
      secondary: '#1E293B',   // Slightly lighter
      tertiary: '#334155',    // Card backgrounds
      elevated: '#475569'     // Elevated surfaces
    },
    surface: {
      primary: '#1E293B',
      secondary: '#334155',
      elevated: '#475569',
      overlay: 'rgba(255, 255, 255, 0.05)'
    },
    border: {
      primary: '#475569',
      secondary: '#64748B',
      focus: '#DC143C'
    }
  }
};

// === EXECUTIVE TYPOGRAPHY ===
// Financial Times / Wall Street Journal inspired typography

const executiveTypography = {
  // PRIMARY FONT STACK - Bloomberg Terminal inspired
  fontFamily: {
    primary: [
      'Inter',                 // Modern, highly legible
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'sans-serif'
    ].join(','),
    
    // SECONDARY FONT - For headings and emphasis
    secondary: [
      'Playfair Display',      // Sophisticated serif for headlines
      'Georgia',
      'Times New Roman',
      'serif'
    ].join(','),
    
    // MONOSPACE - For data and metrics
    mono: [
      'JetBrains Mono',
      'SF Mono',
      'Monaco',
      'Consolas',
      'Liberation Mono',
      'monospace'
    ].join(',')
  },

  // EXECUTIVE HIERARCHY - Carefully calibrated scales
  scale: {
    // DISPLAY TYPOGRAPHY - Hero sections
    display1: {
      fontSize: '3.5rem',
      fontWeight: 300,
      lineHeight: 1.1,
      letterSpacing: '-0.025em'
    },
    display2: {
      fontSize: '2.75rem', 
      fontWeight: 300,
      lineHeight: 1.2,
      letterSpacing: '-0.02em'
    },

    // HEADLINE TYPOGRAPHY - Section headers
    headline1: {
      fontSize: '2.25rem',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '-0.015em'
    },
    headline2: {
      fontSize: '1.875rem',
      fontWeight: 600, 
      lineHeight: 1.25,
      letterSpacing: '-0.01em'
    },
    headline3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.005em'
    },

    // TITLE TYPOGRAPHY - Card headers, labels
    title1: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: '0em'
    },
    title2: {
      fontSize: '1.125rem',
      fontWeight: 500,
      lineHeight: 1.4, 
      letterSpacing: '0.005em'
    },

    // BODY TYPOGRAPHY - Content
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '0.01em'
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.015em'
    },

    // LABEL TYPOGRAPHY - UI elements
    label1: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: '0.02em'
    },
    label2: {
      fontSize: '0.75rem',
      fontWeight: 500,
      lineHeight: 1.3,
      letterSpacing: '0.025em'
    },

    // CAPTION TYPOGRAPHY - Metadata
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.4,
      letterSpacing: '0.03em'
    }
  }
};

// === EXECUTIVE SPACING SYSTEM ===
// 8px base unit with golden ratio progressions

const executiveSpacing = {
  base: 8,
  scale: {
    xs: 4,    // 0.25rem
    sm: 8,    // 0.5rem  
    md: 16,   // 1rem
    lg: 24,   // 1.5rem
    xl: 32,   // 2rem
    xxl: 48,  // 3rem
    xxxl: 64, // 4rem
    xxxxl: 96 // 6rem
  }
};

// === EXECUTIVE SHADOWS ===
// Sophisticated shadow system for depth and hierarchy

const executiveShadows = {
  // LIGHT THEME SHADOWS
  light: {
    none: 'none',
    subtle: '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)',
    small: '0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.06)',
    medium: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
    large: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
    xlarge: '0 25px 50px rgba(0, 0, 0, 0.15), 0 12px 24px rgba(0, 0, 0, 0.08)',
    
    // INTERACTIVE SHADOWS
    hover: '0 12px 20px rgba(0, 0, 0, 0.08), 0 6px 8px rgba(0, 0, 0, 0.04)',
    focus: '0 0 0 3px rgba(220, 20, 60, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
    active: '0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)'
  },

  // DARK THEME SHADOWS - More pronounced for visibility
  dark: {
    none: 'none',
    subtle: '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)',
    small: '0 4px 6px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)',
    medium: '0 10px 15px rgba(0, 0, 0, 0.4), 0 4px 6px rgba(0, 0, 0, 0.2)',
    large: '0 20px 25px rgba(0, 0, 0, 0.4), 0 10px 10px rgba(0, 0, 0, 0.2)',
    xlarge: '0 25px 50px rgba(0, 0, 0, 0.5), 0 12px 24px rgba(0, 0, 0, 0.3)',
    
    hover: '0 12px 20px rgba(0, 0, 0, 0.4), 0 6px 8px rgba(0, 0, 0, 0.2)',
    focus: '0 0 0 3px rgba(220, 20, 60, 0.2), 0 4px 6px rgba(0, 0, 0, 0.3)',
    active: '0 2px 4px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.2)'
  }
};

// === EXECUTIVE ANIMATION SYSTEM ===
// Subtle, professional animations that enhance UX without being distracting

const executiveAnimations = {
  // DURATION SCALES - Based on IBM Carbon and Google Material
  duration: {
    instant: '0ms',
    fast: '150ms',      // Micro-interactions
    moderate: '240ms',   // Standard transitions
    slow: '400ms',      // Complex transitions
    slower: '700ms'     // Page transitions
  },

  // EASING CURVES - Natural, sophisticated motion
  easing: {
    // STANDARD CURVES
    linear: 'linear',
    ease: 'ease',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    
    // EXECUTIVE CURVES - Custom sophisticated easing
    executive: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',  // Sophisticated curve
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',   // Subtle bounce
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',              // Sharp precision
    
    // SPECIALIZED CURVES
    materialStandard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    materialDecelerated: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
    materialAccelerated: 'cubic-bezier(0.4, 0.0, 1, 1)'
  },

  // COMMON TRANSITIONS
  transitions: {
    // BASIC PROPERTIES
    all: 'all 240ms cubic-bezier(0.4, 0, 0.2, 1)',
    color: 'color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    background: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    border: 'border 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    shadow: 'box-shadow 240ms cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'transform 240ms cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: 'opacity 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    
    // COMPOUND TRANSITIONS
    hover: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    focus: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    slide: 'transform 240ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    fade: 'opacity 240ms cubic-bezier(0.4, 0, 0.2, 1)',
    scale: 'transform 150ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  }
};

// === EXECUTIVE LAYOUT GRID ===
// 12-column responsive grid with executive-appropriate breakpoints

const executiveGrid = {
  // BREAKPOINTS - Tailored for executive viewing patterns
  breakpoints: {
    xs: 0,      // Mobile phones
    sm: 600,    // Large phones / small tablets
    md: 960,    // Tablets
    lg: 1280,   // Laptops / small desktops
    xl: 1600,   // Large desktops / exec monitors
    xxl: 1920   // Ultra-wide monitors
  },

  // CONTAINER SIZES
  container: {
    xs: '100%',
    sm: '540px',
    md: '720px', 
    lg: '960px',
    xl: '1140px',
    xxl: '1320px'
  },

  // GRID CONFIGURATION
  columns: 12,
  gutterWidth: 24,
  
  // RESPONSIVE MARGINS
  margins: {
    xs: 16,
    sm: 24,
    md: 32,
    lg: 48,
    xl: 64,
    xxl: 80
  }
};

// === EXECUTIVE COMPONENT SPECIFICATIONS ===

const executiveComponents = {
  // METRIC CARDS - Primary KPI display
  metricCard: {
    minHeight: 140,
    borderRadius: 12,
    padding: 24,
    background: {
      light: executiveColors.light.background.primary,
      dark: executiveColors.dark.background.secondary
    },
    shadow: {
      default: executiveShadows.light.small,
      hover: executiveShadows.light.hover,
      dark: executiveShadows.dark.small
    },
    border: {
      width: 1,
      color: {
        light: executiveColors.light.border.primary,
        dark: executiveColors.dark.border.primary
      }
    },
    transition: executiveAnimations.transitions.hover
  },

  // EXECUTIVE CHARTS - Data visualization containers
  chartContainer: {
    minHeight: 400,
    borderRadius: 8,
    padding: 20,
    background: {
      light: executiveColors.light.background.primary,
      dark: executiveColors.dark.background.secondary
    },
    shadow: {
      default: executiveShadows.light.medium,
      dark: executiveShadows.dark.medium
    },
    border: {
      width: 1,
      color: {
        light: executiveColors.light.border.primary,
        dark: executiveColors.dark.border.primary
      }
    }
  },

  // NAVIGATION - Top-tier navigation styling
  navigation: {
    height: 72,
    background: {
      light: executiveColors.light.background.primary,
      dark: executiveColors.dark.background.primary
    },
    shadow: {
      light: executiveShadows.light.small,
      dark: executiveShadows.dark.small
    },
    border: {
      bottom: {
        width: 1,
        color: {
          light: executiveColors.light.border.primary,
          dark: executiveColors.dark.border.primary
        }
      }
    }
  },

  // SIDEBAR - Executive-appropriate sidebar
  sidebar: {
    width: 280,
    background: {
      light: executiveColors.light.background.secondary,
      dark: executiveColors.dark.background.primary
    },
    border: {
      right: {
        width: 1,
        color: {
          light: executiveColors.light.border.primary,
          dark: executiveColors.dark.border.primary
        }
      }
    }
  },

  // BUTTONS - Executive button styling
  button: {
    primary: {
      height: 40,
      borderRadius: 6,
      padding: '0 20px',
      background: executiveColors.redCross.crimson,
      color: executiveColors.neutrals.white,
      fontWeight: 500,
      fontSize: '0.875rem',
      textTransform: 'none',
      shadow: executiveShadows.light.subtle,
      transition: executiveAnimations.transitions.hover,
      hover: {
        background: executiveColors.redCross.deepCrimson,
        shadow: executiveShadows.light.small,
        transform: 'translateY(-1px)'
      }
    },
    secondary: {
      height: 40,
      borderRadius: 6,
      padding: '0 20px',
      background: 'transparent',
      color: executiveColors.redCross.crimson,
      border: `1px solid ${executiveColors.redCross.crimson}`,
      fontWeight: 500,
      fontSize: '0.875rem',
      textTransform: 'none',
      transition: executiveAnimations.transitions.hover,
      hover: {
        background: executiveColors.redCross.crimson,
        color: executiveColors.neutrals.white,
        transform: 'translateY(-1px)'
      }
    }
  }
};

// === DATA VISUALIZATION COLORS ===
// Sophisticated palette for charts and graphs

const executiveDataColors = {
  // PRIMARY SERIES - Red Cross brand progression
  primary: [
    '#DC143C', // Red Cross crimson
    '#B71C1C', // Deep crimson
    '#8B0000', // Blood red
    '#FF6B6B', // Light crimson
    '#E57373'  // Soft crimson
  ],

  // QUALITATIVE PALETTE - For categorical data
  qualitative: [
    '#DC143C', // Red Cross red
    '#1E40AF', // Executive blue
    '#047857', // Success green
    '#B45309', // Professional amber
    '#7C3AED', // Royal purple
    '#DB2777', // Sophisticated pink
    '#0891B2', // Teal
    '#9333EA', // Violet
    '#C2410C', // Orange
    '#059669'  // Emerald
  ],

  // SEQUENTIAL PALETTES - For continuous data
  sequential: {
    reds: ['#FEE2E2', '#FECACA', '#FCA5A5', '#F87171', '#EF4444', '#DC2626', '#B91C1C', '#991B1B'],
    blues: ['#DBEAFE', '#BFDBFE', '#93C5FD', '#60A5FA', '#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF'],
    greens: ['#D1FAE5', '#A7F3D0', '#6EE7B7', '#34D399', '#10B981', '#059669', '#047857', '#065F46']
  },

  // DIVERGING PALETTES - For data with natural midpoint
  diverging: {
    redBlue: ['#B91C1C', '#DC2626', '#EF4444', '#F87171', '#F3F4F6', '#60A5FA', '#3B82F6', '#2563EB', '#1E40AF'],
    redGreen: ['#B91C1C', '#DC2626', '#EF4444', '#F87171', '#F3F4F6', '#34D399', '#10B981', '#059669', '#047857']
  }
};

// === EXPORT COMPLETE DESIGN SYSTEM ===

export const executiveDesignSystem = {
  colors: executiveColors,
  typography: executiveTypography,
  spacing: executiveSpacing,
  shadows: executiveShadows,
  animations: executiveAnimations,
  grid: executiveGrid,
  components: executiveComponents,
  dataColors: executiveDataColors
};

// === CREATE MATERIAL-UI THEME ===

export const createExecutiveTheme = (mode = 'light') => {
  const colors = executiveColors;
  const isLight = mode === 'light';
  
  return createTheme({
    palette: {
      mode,
      primary: {
        main: colors.redCross.crimson,
        dark: colors.redCross.deepCrimson,
        light: colors.redCross.lightCrimson,
        contrastText: colors.neutrals.white
      },
      secondary: {
        main: colors.neutrals.charcoal,
        dark: colors.neutrals.slate,
        light: colors.neutrals.graphite,
        contrastText: colors.neutrals.white
      },
      error: {
        main: colors.status.error.primary,
        light: colors.status.error.light,
        dark: colors.status.error.accent
      },
      warning: {
        main: colors.status.warning.primary,
        light: colors.status.warning.light,
        dark: colors.status.warning.accent
      },
      success: {
        main: colors.status.success.primary,
        light: colors.status.success.light,
        dark: colors.status.success.accent
      },
      info: {
        main: colors.status.info.primary,
        light: colors.status.info.light,
        dark: colors.status.info.accent
      },
      background: {
        default: isLight ? colors.light.background.secondary : colors.dark.background.primary,
        paper: isLight ? colors.light.background.primary : colors.dark.background.secondary
      },
      text: {
        primary: isLight ? colors.neutrals.charcoal : colors.neutrals.white,
        secondary: isLight ? colors.neutrals.slate : colors.neutrals.silver,
        disabled: colors.neutrals.platinum
      },
      divider: isLight ? colors.light.border.primary : colors.dark.border.primary
    },

    typography: {
      fontFamily: executiveTypography.fontFamily.primary,
      h1: {
        ...executiveTypography.scale.display1,
        fontFamily: executiveTypography.fontFamily.secondary
      },
      h2: {
        ...executiveTypography.scale.headline1,
        fontFamily: executiveTypography.fontFamily.secondary
      },
      h3: {
        ...executiveTypography.scale.headline2,
        fontFamily: executiveTypography.fontFamily.secondary
      },
      h4: {
        ...executiveTypography.scale.headline3,
        fontFamily: executiveTypography.fontFamily.secondary
      },
      h5: executiveTypography.scale.title1,
      h6: executiveTypography.scale.title2,
      body1: executiveTypography.scale.body1,
      body2: executiveTypography.scale.body2,
      button: {
        ...executiveTypography.scale.label1,
        textTransform: 'none'
      },
      caption: executiveTypography.scale.caption
    },

    shape: {
      borderRadius: 8
    },

    spacing: executiveSpacing.base,

    shadows: isLight ? [
      'none',
      executiveShadows.light.subtle,
      executiveShadows.light.small,
      executiveShadows.light.medium,
      executiveShadows.light.large,
      executiveShadows.light.xlarge,
      executiveShadows.light.xlarge,
      executiveShadows.light.xlarge,
      executiveShadows.light.xlarge,
      executiveShadows.light.xlarge,
      executiveShadows.light.xlarge,
      executiveShadows.light.xlarge,
      executiveShadows.light.xlarge,
      executiveShadows.light.xlarge,
      executiveShadows.light.xlarge,
      executiveShadows.light.xlarge,
      executiveShadows.light.xlarge,
      executiveShadows.light.xlarge,
      executiveShadows.light.xlarge,
      executiveShadows.light.xlarge,
      executiveShadows.light.xlarge,
      executiveShadows.light.xlarge,
      executiveShadows.light.xlarge,
      executiveShadows.light.xlarge,
      executiveShadows.light.xlarge
    ] : [
      'none',
      executiveShadows.dark.subtle,
      executiveShadows.dark.small,
      executiveShadows.dark.medium,
      executiveShadows.dark.large,
      executiveShadows.dark.xlarge,
      executiveShadows.dark.xlarge,
      executiveShadows.dark.xlarge,
      executiveShadows.dark.xlarge,
      executiveShadows.dark.xlarge,
      executiveShadows.dark.xlarge,
      executiveShadows.dark.xlarge,
      executiveShadows.dark.xlarge,
      executiveShadows.dark.xlarge,
      executiveShadows.dark.xlarge,
      executiveShadows.dark.xlarge,
      executiveShadows.dark.xlarge,
      executiveShadows.dark.xlarge,
      executiveShadows.dark.xlarge,
      executiveShadows.dark.xlarge,
      executiveShadows.dark.xlarge,
      executiveShadows.dark.xlarge,
      executiveShadows.dark.xlarge,
      executiveShadows.dark.xlarge,
      executiveShadows.dark.xlarge
    ],

    components: {
      // EXECUTIVE BUTTON STYLING
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.875rem',
            padding: '10px 20px',
            transition: executiveAnimations.transitions.hover,
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: isLight ? executiveShadows.light.hover : executiveShadows.dark.hover
            }
          },
          contained: {
            boxShadow: isLight ? executiveShadows.light.subtle : executiveShadows.dark.subtle,
            '&:hover': {
              boxShadow: isLight ? executiveShadows.light.small : executiveShadows.dark.small
            }
          },
          outlined: {
            borderWidth: 1,
            '&:hover': {
              borderWidth: 1
            }
          }
        }
      },

      // EXECUTIVE CARD STYLING
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            border: `1px solid ${isLight ? colors.light.border.primary : colors.dark.border.primary}`,
            boxShadow: isLight ? executiveShadows.light.small : executiveShadows.dark.small,
            transition: executiveAnimations.transitions.hover,
            '&:hover': {
              boxShadow: isLight ? executiveShadows.light.hover : executiveShadows.dark.hover,
              transform: 'translateY(-2px)'
            }
          }
        }
      },

      // EXECUTIVE PAPER STYLING
      MuiPaper: {
        styleOverrides: {
          root: {
            border: `1px solid ${isLight ? colors.light.border.primary : colors.dark.border.primary}`,
            transition: executiveAnimations.transitions.all
          },
          elevation1: {
            boxShadow: isLight ? executiveShadows.light.small : executiveShadows.dark.small
          },
          elevation2: {
            boxShadow: isLight ? executiveShadows.light.medium : executiveShadows.dark.medium
          },
          elevation3: {
            boxShadow: isLight ? executiveShadows.light.large : executiveShadows.dark.large
          }
        }
      },

      // EXECUTIVE APPBAR STYLING
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isLight ? colors.light.background.primary : colors.dark.background.primary,
            borderBottom: `1px solid ${isLight ? colors.light.border.primary : colors.dark.border.primary}`,
            boxShadow: isLight ? executiveShadows.light.small : executiveShadows.dark.small,
            backdropFilter: 'blur(12px)',
            '& .MuiToolbar-root': {
              minHeight: 72,
              padding: '0 32px'
            }
          }
        }
      },

      // EXECUTIVE TAB STYLING
      MuiTabs: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${isLight ? colors.light.border.primary : colors.dark.border.primary}`,
            '& .MuiTabs-indicator': {
              backgroundColor: colors.redCross.crimson,
              height: 3,
              borderRadius: '3px 3px 0 0'
            }
          }
        }
      },

      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.875rem',
            minHeight: 48,
            transition: executiveAnimations.transitions.all,
            '&:hover': {
              color: colors.redCross.crimson,
              backgroundColor: isLight ? colors.light.surface.overlay : colors.dark.surface.overlay
            },
            '&.Mui-selected': {
              color: colors.redCross.crimson,
              fontWeight: 600
            }
          }
        }
      },

      // EXECUTIVE CHIP STYLING
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            fontWeight: 500,
            fontSize: '0.75rem',
            height: 28,
            border: `1px solid ${isLight ? colors.light.border.primary : colors.dark.border.primary}`,
            transition: executiveAnimations.transitions.all,
            '&:hover': {
              transform: 'scale(1.02)'
            }
          },
          colorPrimary: {
            backgroundColor: colors.redCross.crimson,
            color: colors.neutrals.white,
            border: `1px solid ${colors.redCross.crimson}`
          }
        }
      },

      // EXECUTIVE TOOLTIP STYLING
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: isLight ? colors.neutrals.charcoal : colors.neutrals.white,
            color: isLight ? colors.neutrals.white : colors.neutrals.charcoal,
            fontSize: '0.75rem',
            fontWeight: 500,
            borderRadius: 6,
            padding: '8px 12px',
            boxShadow: isLight ? executiveShadows.light.medium : executiveShadows.dark.medium,
            border: `1px solid ${isLight ? colors.light.border.secondary : colors.dark.border.secondary}`
          }
        }
      }
    }
  });
};

export default executiveDesignSystem;