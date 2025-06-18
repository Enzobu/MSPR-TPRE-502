import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from './HomePage';

// Mock de React pour éviter les erreurs de hooks
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useRef: vi.fn(() => ({ current: null })),
    useEffect: vi.fn()
  };
});

// Mock de react-router-dom
vi.mock('react-router-dom', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
  useNavigate: () => vi.fn()
}));

// Mock du contexte d'authentification
vi.mock('react-auth-kit/hooks/useUser', () => ({
  default: () => ({
    id: 1,
    firstname: 'John',
    lastname: 'Doe',
    email: 'john@example.com'
  })
}));

// Mock du contexte d'authentification complet
vi.mock('react-auth-kit/AuthContext', () => ({
  useReactAuthKit: () => ({
    set: vi.fn(),
    get: () => ({
      auth: {
        token: 'mock-token',
        type: 'Bearer',
        expiresAt: new Date(Date.now() + 3600000)
      },
      userState: {
        id: 1,
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@example.com'
      }
    })
  })
}));

// Mock du hook useSignOut
vi.mock('react-auth-kit/hooks/useSignOut', () => ({
  default: () => vi.fn()
}));

describe('HomePage', () => {
  it('affiche la page d\'accueil', () => {
    render(<HomePage />);
    expect(screen.getByText('Bienvenue')).toBeInTheDocument();
  });
}); 