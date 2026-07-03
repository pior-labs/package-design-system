import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@pior-labs/design-system';
import './styles.css';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider storageKey="pior-theme-lab-theme">
      <App />
    </ThemeProvider>
  </StrictMode>
);
