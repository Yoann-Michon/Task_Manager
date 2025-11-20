import { createContext, useContext, useState, useCallback } from 'react';
import type { AlertColor } from '@mui/material';
import type { SnackbarContextType, SnackbarMessage, SnackbarProviderProps } from '../models/snackbar.interface';

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

export const SnackbarProvider = ({ children }: SnackbarProviderProps) => {
  const [open, setOpen] = useState(false);
  const [snackbarData, setSnackbarData] = useState<SnackbarMessage>({
    message: '',
    severity: 'info',
    duration: 4000,
  });

  const showSnackbar = useCallback(
    (message: string, severity: AlertColor = 'info', duration: number = 4000) => {
      setSnackbarData({ message, severity, duration });
      setOpen(true);
    },
    []
  );

  const showSuccess = useCallback(
    (message: string, duration?: number) => {
      showSnackbar(message, 'success', duration);
    },
    [showSnackbar]
  );

  const showError = useCallback(
    (message: string, duration?: number) => {
      showSnackbar(message, 'error', duration);
    },
    [showSnackbar]
  );

  const showWarning = useCallback(
    (message: string, duration?: number) => {
      showSnackbar(message, 'warning', duration);
    },
    [showSnackbar]
  );

  const showInfo = useCallback(
    (message: string, duration?: number) => {
      showSnackbar(message, 'info', duration);
    },
    [showSnackbar]
  );

  const closeSnackbar = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <SnackbarContext.Provider
      value={{
        open,
        snackbarData,
        showSnackbar,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        closeSnackbar,
      }}
    >
      {children}
    </SnackbarContext.Provider>
  );
};