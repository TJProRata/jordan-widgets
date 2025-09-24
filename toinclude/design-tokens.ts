/**
 * src/lib/design-tokens.ts
 * Design tokens for the NYTimes Widget
 * Based on Figma specifications
 * Following "Thinking in React" principles - these are our constants
 */

export const tokens = {
  colors: {
    primary: '#B8FFE3',
    secondary: '#C081FF',
    gradient: {
      start: '#B8FFE3',
      end: '#C081FF',
      direction: '90deg'
    },
    surface: {
      light: 'rgba(255, 255, 255, 0.10)',
      dark: 'rgba(0, 0, 0, 0.20)'
    },
    text: {
      primary: '#FFFFFF',
      accent: '#B8FFE3'
    },
    background: {
      logo: '#000000',
      overlay: 'rgba(255, 255, 255, 0.10)'
    },
    sources: {
      nyt: '#6E5FBC',      // NYT Purple (front)
      dailyMail: '#594495', // Daily Mail Darker Purple
      aw: '#603C75',        // AW Even Darker Purple
      more: '#333333'       // More Dark Gray (back)
    }
  },
  spacing: {
    xs: '4px',
    sm: '5px',
    md: '6px',
    lg: '10px',
    xl: '12px',
    '2xl': '20px',
    '3xl': '24px',
    buttonPadding: {
      top: '7.63px',
      bottom: '7.63px',
      left: '12px',
      right: '0.50px'
    },
    expandedPadding: {
      top: '20px',
      bottom: '10px',
      left: '20px',
      right: '20px'
    }
  },
  typography: {
    fontFamily: 'Work Sans, sans-serif',
    sizes: {
      xs: '10px',
      sm: '16px',
      lg: '24px'
    },
    lineHeights: {
      xs: '14px',
      sm: '22.40px',
      lg: '33.60px',
      relaxed: '24px'
    },
    weights: {
      normal: 400,
      medium: 500
    }
  },
  borderRadius: {
    sm: '30px',
    md: '37px',
    lg: '40px',
    xl: '41px',
    full: '9999px',
    microphone: '3px'
  },
  dimensions: {
    compactButton: {
      width: '118.68px',
      height: '51px'
    },
    expandedContainer: {
      maxWidth: '400px',
      minHeight: '365px'
    },
    searchBar: {
      width: '360px',
      height: '52px'
    },
    logo: {
      container: {
        width: '48px',
        height: '48px'
      },
      image: {
        width: '23px',
        height: '27px',
        position: {
          left: '11px',
          top: '9.50px'
        }
      }
    },
    icons: {
      sparkle: {
        small: {
          width: '14px',
          height: '14px'
        },
        large: {
          width: '16px',
          height: '15px'
        }
      },
      plus: {
        container: {
          width: '16px',
          height: '16px'
        },
        inner: {
          width: '10.50px',
          height: '10.50px',
          position: {
            left: '2.75px',
            top: '2.75px'
          }
        }
      },
      mic: {
        container: {
          width: '16px',
          height: '16px'
        },
        rect: {
          width: '4px',
          height: '7.33px',
          position: {
            left: '6px',
            top: '2px'
          }
        },
        circle: {
          width: '8px',
          height: '8px',
          position: {
            left: '4px',
            top: '3.33px'
          }
        }
      },
      gradient: {
        width: '13.57px',
        height: '17.40px'
      }
    },
    moreButton: {
      width: '96px',
      height: '30px',
      padding: {
        top: '4px',
        bottom: '4px'
      }
    },
    suggestionsList: {
      width: '330px',
      gap: '12px'
    },
    poweredBy: {
      logo: {
        width: '96px',
        height: '20px'
      }
    }
  },
  effects: {
    boxShadow: '0px 1.2722645998001099px 15.267175674438477px rgba(0, 0, 0, 0.05)',
    outline: '0.5px solid #C081FF',
    outlineOffset: '-0.5px',
    outlineWhite: '1px solid white'
  },
  animations: {
    spring: {
      type: 'spring',
      stiffness: 400,
      damping: 17
    },
    duration: {
      fast: 150,
      normal: 300,
      slow: 500
    }
  }
} as const;

// Type exports for TypeScript
export type ColorToken = typeof tokens.colors;
export type SpacingToken = typeof tokens.spacing;
export type TypographyToken = typeof tokens.typography;
export type DimensionToken = typeof tokens.dimensions;