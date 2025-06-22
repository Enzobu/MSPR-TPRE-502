import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '../../test-utils';
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
  beforeEach(() => {
    render(<UserRegister />);
  });

  it('devrait afficher le champ de saisie du nom', () => {
    expect(screen.getByLabelText(/^name$/i)).toBeInTheDocument();
  });

  it('devrait afficher le champ de saisie du nom de famille', () => {
    expect(screen.getByLabelText(/^last name$/i)).toBeInTheDocument();
  });

  it("devrait afficher le champ de saisie de l'e-mail", () => {
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
  });

  it('devrait afficher le champ de saisie du mot de passe', () => {
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("devrait afficher le bouton d'inscription", () => {
    expect(screen.getByRole('button', { name: /s'inscrire/i })).toBeInTheDocument();
  });
}); 