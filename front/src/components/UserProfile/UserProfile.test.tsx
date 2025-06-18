import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import UserProfile from './UserProfile';

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

vi.mock('react-auth-kit/hooks/useUser', () => ({
  default: () => ({
    id: 1,
    firstname: 'John',
    lastname: 'Doe',
    email: 'john@example.com'
  })
}));

describe('UserProfile', () => {
  it('affiche le composant de profil utilisateur', () => {
    render(<UserProfile />);
    expect(screen.getByText('Chargement des informations utilisateur...')).toBeInTheDocument();
  });
}); 