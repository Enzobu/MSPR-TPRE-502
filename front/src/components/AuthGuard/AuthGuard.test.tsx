import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AuthGuard from './AuthGuard';

// Mock de react-router-dom
vi.mock('react-router-dom', () => ({
  Navigate: ({ to }: { to: string }) => <div data-testid="navigate" data-to={to} />,
  Outlet: () => <div data-testid="outlet" />
}));

// Mock des hooks d'authentification
vi.mock('react-auth-kit/hooks/useIsAuthenticated', () => ({
  default: () => true
}));

describe('AuthGuard', () => {
  it('affiche le contenu protégé quand l\'utilisateur est authentifié', () => {
    render(
      <AuthGuard>
        <div data-testid="protected-content">Contenu protégé</div>
      </AuthGuard>
    );
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });
}); 