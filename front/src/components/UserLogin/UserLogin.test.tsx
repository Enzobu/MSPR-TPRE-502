import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '../../test-utils';
import UserLogin from './UserLogin';

// Mock des hooks
vi.mock('react-auth-kit/hooks/useSignIn', () => ({
  default: vi.fn(() => vi.fn()),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(() => vi.fn()),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => <a href={to}>{children}</a>,
}));

// Mock de fetch
global.fetch = vi.fn();

describe('UserLogin', () => {
  beforeEach(() => {
    render(<UserLogin />);
  });

  it("devrait afficher le champ de saisie de l'e-mail", () => {
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
  });

  it('devrait afficher le champ de saisie du mot de passe', () => {
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
  });

  it("devrait afficher le bouton de connexion", () => {
    expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
  });

  it('devrait avoir les champs avec les bons attributs', () => {
    const emailInput = screen.getByLabelText(/e-mail/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('required');
    expect(emailInput).toHaveAttribute('aria-required', 'true');
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toHaveAttribute('required');
    expect(passwordInput).toHaveAttribute('aria-required', 'true');
  });

  it('devrait avoir les placeholders corrects', () => {
    const emailInput = screen.getByLabelText(/e-mail/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    
    expect(emailInput).toHaveAttribute('placeholder', 'Entrez votre email');
    expect(passwordInput).toHaveAttribute('placeholder', 'Entrez votre mot de passe');
  });

  it('devrait avoir la structure de formulaire correcte', () => {
    const form = screen.getByRole('button', { name: /se connecter/i }).closest('form');
    expect(form).toBeInTheDocument();
    expect(form).toHaveClass('loginForm');
  });

  it('devrait avoir le bouton avec le bon texte et attributs', () => {
    const submitButton = screen.getByRole('button', { name: /se connecter/i });
    expect(submitButton).toHaveTextContent('Sign in');
    expect(submitButton).toHaveAttribute('type', 'submit');
    expect(submitButton).toHaveAttribute('aria-label', 'Se connecter');
  });
}); 