import { createContext, useContext, useState, useMemo, type ReactNode } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const COLORS = {
  light: {
    
    background: {
      default: '#f2f8f9',      
      paper: '#deebef',       
      sidebar: '#c0d7e1',      
      selected: '#95bbcb',    
      hover: 'rgba(98, 150, 174, 0.1)', 
    },
    text: {
      primary: '#2e3e4b',      
      secondary: '#334757',    
      tertiary: '#375467',    
    },
    border: '#95bbcb',         
    divider: '#c0d7e1',        
    icon: '#3d647d',          
    iconSelected: '#3D99F5',   
    primary: '#477a93',        
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  },
  dark: {
    background: {
      default: '#121A21',
      paper: '#1A2027',
      sidebar: '#121A21',
      selected: '#243347',
      hover: 'rgba(61, 153, 245, 0.1)',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#E2E8F0',
      tertiary: '#99ABC2',
    },
    border: '#243347',
    divider: '#243347',
    icon: '#99ABC2',
    iconSelected: '#3D99F5',
    primary: '#3D99F5',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  },
};

interface ThemeColors {
  background: {
    default: string;
    paper: string;
    sidebar: string;
    selected: string;
    hover: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  border: string;
  divider: string;
  icon: string;
  iconSelected: string;
  primary: string;
  success: string;
  warning: string;
  error: string;
}

interface ThemeModeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  colors: ThemeColors;
}

const ThemeModeContext = createContext<ThemeModeContextType | undefined>(undefined);

export const ThemeModeProvider = ({ children }: { children: ReactNode }) => {
  const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [darkMode, setDarkMode] = useState(prefersDarkMode);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const colors = useMemo(() => {
    return darkMode ? COLORS.dark : COLORS.light;
  }, [darkMode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: {
            main: colors.primary,
          },
          background: {
            default: colors.background.default,
            paper: colors.background.paper,
          },
          text: {
            primary: colors.text.primary,
            secondary: colors.text.secondary,
          },
          divider: colors.divider,
          success: {
            main: colors.success,
          },
          warning: {
            main: colors.warning,
          },
          error: {
            main: colors.error,
          },
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                backgroundColor: colors.background.default,
                color: colors.text.primary,
                transition: 'background-color 0.3s ease, color 0.3s ease',
              },
            },
          },
        },
      }),
    [darkMode, colors]
  );

  return (
    <ThemeModeContext.Provider value={{ darkMode, toggleDarkMode, colors }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export const useThemeMode = () => {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error("useThemeMode must be used within a ThemeModeProvider");
  }
  return context;
};

export const useThemeColors = () => {
  const { colors } = useThemeMode();
  return colors;
};