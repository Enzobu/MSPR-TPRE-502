import { describe, it, expect, vi, type Mock } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import AuthGuard from './AuthGuard';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import AuthProvider from 'react-auth-kit';
import createStore from 'react-auth-kit/createStore';

// Mock du hook
vi.mock('react-auth-kit/hooks/useIsAuthenticated');

const MockLoginPage = () => <div>Page de connexion</div>;
const ProtectedContent = () => <div>Contenu protégé</div>;

const store = createStore({
  authName: '_auth',
  authType: 'cookie',
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === 'https:',
});

const renderWithRouter = (isAuthenticated: boolean) => {
  (useIsAuthenticated as Mock).mockReturnValue(isAuthenticated);
  
  return render(
    <AuthProvider store={store}>
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<MockLoginPage />} />
          <Route path="/protected" element={<AuthGuard><ProtectedContent /></AuthGuard>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
};

describe('AuthGuard', () => {
  describe("quand l'utilisateur est authentifié", () => {
    it('devrait afficher le contenu protégé', () => {
      renderWithRouter(true);
      expect(screen.getByText('Contenu protégé')).toBeInTheDocument();
    });
  });

  describe("quand l'utilisateur n'est pas authentifié", () => {
    it('devrait rediriger vers la page de connexion', () => {
      renderWithRouter(false);
      expect(screen.getByText('Page de connexion')).toBeInTheDocument();
    });
  });
}); 