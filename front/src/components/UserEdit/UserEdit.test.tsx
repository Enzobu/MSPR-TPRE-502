import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import UserEdit from './UserEdit';

// Mock de React pour éviter les erreurs de hooks
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useState: vi.fn(() => [{ firstname: 'John', lastname: 'Doe', email: 'john@example.com', role: 'user' }, vi.fn()]),
    useEffect: vi.fn()
  };
});

// Mock du hook useUpdateUser
vi.mock('../../hooks/useUpdateUser', () => ({
  default: () => ({
    updateUser: vi.fn(),
    loading: false,
    error: null
  })
}));

describe('UserEdit', () => {
  it('affiche le formulaire d\'édition utilisateur', () => {
    const mockUser = {
      id: 1,
      id_user: 1,
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com',
      role: 'user',
      isAdmin: false
    };
    const mockOnClose = () => {};
    const mockOnUpdate = () => {};
    
    render(<UserEdit user={mockUser} onClose={mockOnClose} onUpdate={mockOnUpdate} />);
    expect(screen.getByText('Modifier l\'utilisateur')).toBeInTheDocument();
  });
}); 