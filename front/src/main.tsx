import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from 'react-auth-kit/AuthProvider';
import store from './auth-config';
import { ThemeProvider } from './contexts/ThemeContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider store={store}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);