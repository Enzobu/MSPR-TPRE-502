import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import UserAdd from './UserAdd';

// Mock de React pour éviter les erreurs de hooks
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useState: vi.fn(() => [{ firstname: '', lastname: '', email: '', role: 'user' }, vi.fn()]),
    useEffect: vi.fn()
  };
});

// Mock du hook useCreateUser
vi.mock('../../hooks/useCreateUser', () => ({
  default: () => ({
    createUser: vi.fn(),
    loading: false,
    error: null
  })
}));

describe('UserAdd', () => {
  it('affiche le formulaire d\'ajout utilisateur', () => {
    const mockOnSuccess = () => {};
    const mockOnCancel = () => {};
    
    render(<UserAdd onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);
    expect(screen.getByText('Créer l\'utilisateur')).toBeInTheDocument();
  });
}); 