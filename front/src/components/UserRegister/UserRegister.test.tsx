import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import UserRegister from './UserRegister';

// Mock de React pour éviter les erreurs de hooks
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useState: vi.fn(() => [{ firstname: '', lastname: '', email: '', password: '' }, vi.fn()]),
    useEffect: vi.fn()
  };
});

// Mock des hooks d'authentification
vi.mock('react-auth-kit/hooks/useSignIn', () => ({
  default: () => vi.fn()
}));

describe('UserRegister', () => {
  it('affiche le formulaire d\'inscription', () => {
    render(<UserRegister />);
    expect(screen.getByText('Sign up')).toBeInTheDocument();
  });
}); 