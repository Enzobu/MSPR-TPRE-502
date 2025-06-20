import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '../../test-utils';
import PasswordChange from './PasswordChange';
import useLoggedUser from '../../hooks/useLoggedUser';

// Mock du hook useLoggedUser
vi.mock('../../hooks/useLoggedUser');

describe('PasswordChange', () => {
  beforeEach(() => {
    // Fournir une valeur de retour pour le mock
    (useLoggedUser as vi.Mock).mockReturnValue({
      user: { id_user: 1 },
      loading: false,
      error: null,
    });
    render(<PasswordChange />);
  });

  it("devrait afficher le titre 'Changer le mot de passe'", () => {
    expect(screen.getByText('Changer le mot de passe')).toBeInTheDocument();
  });

  it("devrait afficher le champ de l'ancien mot de passe", () => {
    expect(screen.getByLabelText(/ancien mot de passe/i)).toBeInTheDocument();
  });

  it('devrait afficher le champ du nouveau mot de passe', () => {
    expect(screen.getByLabelText(/^nouveau mot de passe/i)).toBeInTheDocument();
  });

  it('devrait afficher le champ de confirmation du mot de passe', () => {
    expect(screen.getByLabelText(/^confirmer le nouveau mot de passe/i)).toBeInTheDocument();
  });

  it("devrait afficher le bouton de mise à jour", () => {
    expect(screen.getByRole('button', { name: /mettre à jour/i })).toBeInTheDocument();
  });
}); 