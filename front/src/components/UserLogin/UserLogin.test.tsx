import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import UserLogin from './UserLogin';

// Mock de React pour éviter les erreurs de hooks
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useState: vi.fn(() => [{ email: '', password: '' }, vi.fn()]),
    useEffect: vi.fn()
  };
});

// Mock des hooks d'authentification
vi.mock('react-auth-kit/hooks/useSignIn', () => ({
  default: () => vi.fn()
}));

// Mock de useNavigate
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn()
}));

describe('UserLogin', () => {
  it('affiche le formulaire de connexion', () => {
    render(<UserLogin />);
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });
}); 