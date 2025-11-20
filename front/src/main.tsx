import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './i18n/Config.ts';
import { ThemeModeProvider } from './components/ThemeModeContext.tsx';
import { CssBaseline } from '@mui/material';
import { SnackbarProvider } from './context/SnackbarContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeModeProvider>
      <SnackbarProvider>
        <CssBaseline />
        <App />
      </SnackbarProvider>
    </ThemeModeProvider>
  </StrictMode>,
)
