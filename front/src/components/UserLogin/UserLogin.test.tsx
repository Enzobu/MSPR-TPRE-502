import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '../../test-utils';
import UserLogin from './UserLogin';

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
}); 