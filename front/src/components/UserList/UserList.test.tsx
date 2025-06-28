import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../test-utils';
import UserList from './UserList';

// Mock des hooks d'authentification si nécessaire
vi.mock('react-auth-kit/hooks/useAuthHeader', () => ({
  default: () => 'Bearer mock-token'
}));

// Mock du hook useLoggedUser
vi.mock('../../hooks/useLoggedUser', () => ({
  default: () => ({
    user: { firstname: 'Test', lastname: 'User', isAdmin: true },
    loading: false,
    error: null
  })
}));

// Mock du hook useDeleteUser
vi.mock('../../hooks/useDeleteUser', () => ({
  default: () => ({
    deleteUser: vi.fn(),
    loading: false,
    error: null,
    deletedUserId: null
  })
}));

describe('UserList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('affiche le message de chargement au début', () => {
    render(<UserList />);
    expect(screen.getByText('Chargement des utilisateurs...')).toBeInTheDocument();
  });

  it('affiche le titre et la description', async () => {
    render(<UserList />);
    
    // Attendre que le chargement soit terminé
    await waitFor(() => {
      expect(screen.queryByText('Chargement des utilisateurs...')).not.toBeInTheDocument();
    }, { timeout: 2000 });

    expect(screen.getByText('Gestion des utilisateurs')).toBeInTheDocument();
    expect(screen.getByText('Administrez les comptes utilisateurs')).toBeInTheDocument();
  });

  it('affiche le bouton d\'ajout d\'utilisateur', async () => {
    render(<UserList />);
    
    // Attendre que le chargement soit terminé
    await waitFor(() => {
      expect(screen.queryByText('Chargement des utilisateurs...')).not.toBeInTheDocument();
    }, { timeout: 2000 });

    expect(screen.getByRole('button', { name: /ajouter un utilisateur/i })).toBeInTheDocument();
  });

  it('affiche les utilisateurs après le chargement', async () => {
    render(<UserList />);
    
    // Attendre que le chargement soit terminé et que les utilisateurs apparaissent
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    }, { timeout: 2000 });

    // Vérifier les emails
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    
    // Vérifier les badges de rôle
    expect(screen.getByText('Administrateur')).toBeInTheDocument();
    expect(screen.getByText('Utilisateur')).toBeInTheDocument();
  });
}); 