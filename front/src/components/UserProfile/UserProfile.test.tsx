import { describe, it, expect, vi, type Mock } from 'vitest';
import { render, screen } from '../../test-utils';
import UserProfile from './UserProfile';
import useLoggedUser from '../../hooks/useLoggedUser';

// Mock du hook useLoggedUser
vi.mock('../../hooks/useLoggedUser');

const mockUser = {
  lastname: 'Dupont',
  firstname: 'Jean',
  email: 'jean.dupont@example.com',
  isAdmin: true,
};

describe('UserProfile', () => {

  it("devrait afficher le message de chargement lorsque les données sont en cours de récupération", () => {
    (useLoggedUser as Mock).mockReturnValue({
      user: null,
      loading: true,
      error: null,
    });

    render(<UserProfile />);
    expect(screen.getByText('Chargement des informations utilisateur...')).toBeInTheDocument();
  });

  it("devrait afficher un message d'erreur en cas de problème", () => {
    (useLoggedUser as Mock).mockReturnValue({
      user: null,
      loading: false,
      error: 'Une erreur est survenue',
    });

    render(<UserProfile />);
    expect(screen.getByText('Erreur: Une erreur est survenue')).toBeInTheDocument();
  });

  it("devrait afficher les informations de l'utilisateur une fois chargées", () => {
    (useLoggedUser as Mock).mockReturnValue({
      user: mockUser,
      loading: false,
      error: null,
    });

    render(<UserProfile />);

    expect(screen.getByText('VOTRE PROFIL')).toBeInTheDocument();
    expect(screen.getByText(mockUser.lastname)).toBeInTheDocument();
    expect(screen.getByText(mockUser.firstname)).toBeInTheDocument();
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
    expect(screen.getByText('Administrateur')).toBeInTheDocument();
  });
}); 