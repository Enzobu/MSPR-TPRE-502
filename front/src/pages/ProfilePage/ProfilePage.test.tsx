import { describe, it, expect, vi, type Mock } from 'vitest';
import { render, screen, fireEvent } from '../../test-utils';
import ProfilePage from './ProfilePage';
import useLoggedUser from '../../hooks/useLoggedUser';

// Mock du hook useLoggedUser
vi.mock('../../hooks/useLoggedUser');

const mockUser = {
  id_user: 1,
  lastname: 'Dupont',
  firstname: 'Jean',
  email: 'jean.dupont@example.com',
  isAdmin: false,
};

const mockAdmin = {
  ...mockUser,
  isAdmin: true,
};

describe('ProfilePage', () => {
  it('devrait afficher le message de chargement', () => {
    (useLoggedUser as Mock).mockReturnValue({ loading: true });
    render(<ProfilePage />);
    expect(screen.getByText('Chargement...')).toBeInTheDocument();
  });

  it("devrait afficher un message d'erreur", () => {
    (useLoggedUser as Mock).mockReturnValue({ error: 'Une erreur' });
    render(<ProfilePage />);
    expect(screen.getByText('Erreur : Une erreur')).toBeInTheDocument();
  });

  describe('quand l\'utilisateur est connecté', () => {
    it('devrait afficher les informations du profil par défaut', () => {
      (useLoggedUser as Mock).mockReturnValue({ user: mockUser, loading: false });
      render(<ProfilePage />);
      expect(screen.getByText('Votre Compte')).toBeInTheDocument();
      // Le composant Informations affiche "VOTRE PROFIL"
      expect(screen.getByText('VOTRE PROFIL')).toBeInTheDocument();
    });

    it('ne devrait pas afficher le menu "Utilisateurs" pour un non-admin', () => {
      (useLoggedUser as Mock).mockReturnValue({ user: mockUser, loading: false });
      render(<ProfilePage />);
      expect(screen.queryByText('Utilisateurs')).not.toBeInTheDocument();
    });

    it('devrait afficher le menu "Utilisateurs" pour un admin', () => {
      (useLoggedUser as Mock).mockReturnValue({ user: mockAdmin, loading: false });
      render(<ProfilePage />);
      expect(screen.getByText('Utilisateurs')).toBeInTheDocument();
    });

    it('devrait changer de section au clic sur le menu', () => {
      (useLoggedUser as Mock).mockReturnValue({ user: mockUser, loading: false });
      render(<ProfilePage />);
      
      fireEvent.click(screen.getByText('Mot de passe'));
      // Le composant MotDePasse affiche "Changer le mot de passe"
      expect(screen.getByText('Changer le mot de passe')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Paramètres'));
      // Le composant Parametres affiche "Paramètres du compte"
      expect(screen.getByText('Paramètres du compte')).toBeInTheDocument();
    });
  });
}); 