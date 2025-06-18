import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import PasswordChange from './PasswordChange';

// Mock de React pour éviter les erreurs de hooks
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useState: vi.fn(() => ['', vi.fn()]),
    useEffect: vi.fn()
  };
});

// Mock des hooks d'authentification
vi.mock('react-auth-kit/hooks/useAuthHeader', () => ({
  default: () => 'Bearer mock-token'
}));

describe('PasswordChange', () => {
  it('affiche le formulaire de changement de mot de passe', () => {
    render(<PasswordChange />);
    expect(screen.getByText('Changer le mot de passe')).toBeInTheDocument();
  });
}); 