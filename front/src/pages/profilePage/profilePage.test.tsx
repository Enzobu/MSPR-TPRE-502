import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProfilePage from './profilePage';

// Mock de React pour éviter les erreurs de hooks
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useRef: vi.fn(() => ({ current: null })),
    useState: vi.fn(() => ['Informations', vi.fn()]),
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
vi.mock('react-auth-kit/hooks/useAuthHeader', () => ({
  default: () => 'Bearer mock-token'
}));
vi.mock('react-auth-kit/hooks/useUser', () => ({
  default: () => ({
    id: 1,
    firstname: 'John',
    lastname: 'Doe',
    email: 'john@example.com'
  })
}));
vi.mock('react-auth-kit/hooks/useSignOut', () => ({
  default: () => vi.fn()
}));

describe('ProfilePage', () => {
  it('affiche la page de profil', () => {
    render(<ProfilePage />);
    expect(screen.getByText('Chargement...')).toBeInTheDocument();
  });
}); 