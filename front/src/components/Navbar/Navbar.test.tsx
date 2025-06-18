import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Navbar from './Navbar';

// Mock de react-router-dom
vi.mock('react-router-dom', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to} data-testid={`link-${to}`}>{children}</a>
  ),
  useLocation: () => ({ pathname: '/' }),
  useNavigate: () => vi.fn()
}));

// Mock de React pour éviter les erreurs de hooks
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useRef: vi.fn(() => ({ current: null })),
    useEffect: vi.fn()
  };
});

// Mock du contexte d'authentification
vi.mock('react-auth-kit/hooks/useSignOut', () => ({
  default: () => vi.fn()
}));

describe('Navbar', () => {
  it('affiche la barre de navigation', () => {
    render(<Navbar />);
    expect(screen.getByText('Accueil')).toBeInTheDocument();
  });
}); 