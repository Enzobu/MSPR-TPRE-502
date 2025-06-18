import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import UserList from './UserList';

// Mock de React pour éviter les erreurs de hooks
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useRef: vi.fn(() => ({ current: null })),
    useState: vi.fn(() => [null, vi.fn()]),
    useEffect: vi.fn()
  };
});

// Mock des hooks d'authentification
vi.mock('react-auth-kit/hooks/useAuthHeader', () => ({
  default: () => 'Bearer mock-token'
}));

// Mock du hook useLoggedUser
vi.mock('../../hooks/useLoggedUser', () => ({
  default: () => ({
    user: null,
    loading: true,
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
  it('affiche le composant de liste des utilisateurs', () => {
    render(<UserList />);
    expect(screen.getByText('Chargement des utilisateurs...')).toBeInTheDocument();
  });
}); 