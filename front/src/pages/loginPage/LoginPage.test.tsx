import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoginPage from './LoginPage';

// Mock de React pour éviter les erreurs de hooks
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useRef: vi.fn(() => ({ current: null })),
    useState: vi.fn(() => ['', vi.fn()]),
    useEffect: vi.fn()
  };
});

// Mock de react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  )
}));

// Mock des hooks d'authentification
vi.mock('react-auth-kit/hooks/useSignIn', () => ({
  default: () => vi.fn()
}));

// Mock du composant UserLogin
vi.mock('../../components/UserLogin/UserLogin', () => ({
  default: () => <div data-testid="user-login">Formulaire de connexion</div>
}));

describe('LoginPage', () => {
  it('affiche la page de connexion', () => {
    render(<LoginPage />);
    expect(screen.getByText('Getting started now')).toBeInTheDocument();
  });
}); 