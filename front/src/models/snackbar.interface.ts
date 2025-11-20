import type { ReactNode } from 'react';
import type { AlertColor } from '@mui/material';

export interface SnackbarMessage {
  message: string;
  severity: AlertColor;
  duration?: number;
}

export interface SnackbarContextType {
  open: boolean;
  snackbarData: SnackbarMessage;
  showSnackbar: (message: string, severity?: AlertColor, duration?: number) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
  closeSnackbar: () => void;
}

export interface SnackbarProviderProps {
  children: ReactNode;
}