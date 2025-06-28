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

  it("devrait afficher le champ de saisie de l'email", () => {
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('devrait afficher le champ de saisie du mot de passe', () => {
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
  });

  it("devrait afficher le bouton de connexion", () => {
    expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
  });

  it('devrait avoir les champs avec les bons attributs', () => {
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('devrait avoir les placeholders corrects', () => {
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    
    expect(emailInput).toHaveAttribute('placeholder', 'votre.email@example.com');
    expect(passwordInput).toHaveAttribute('placeholder', '••••••••');
  });

  it('devrait avoir la structure de formulaire correcte', () => {
    const form = screen.getByRole('button', { name: /se connecter/i }).closest('form');
    expect(form).toBeInTheDocument();
    expect(form).toHaveClass('space-y-4');
  });

  it('devrait avoir le bouton avec le bon texte et attributs', () => {
    const submitButton = screen.getByRole('button', { name: /se connecter/i });
    expect(submitButton).toHaveTextContent('Se connecter');
    expect(submitButton).toHaveAttribute('type', 'submit');
  });

  it('devrait afficher le message d\'instruction WHO', () => {
    expect(screen.getByText('Utilisez vos identifiants WHO pour accéder à la plateforme')).toBeInTheDocument();
  });
}); 