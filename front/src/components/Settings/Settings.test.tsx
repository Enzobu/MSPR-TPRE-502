import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '../../test-utils';
import Settings from './Settings';

// Mock de React pour éviter les erreurs de hooks
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useState: vi.fn(() => ['', vi.fn()]),
    useEffect: vi.fn()
  };
});

// Mock des hooks d'authentification
vi.mock('react-auth-kit/hooks/useAuthHeader', () => ({
  default: () => 'Bearer mock-token'
}));

describe('Settings', () => {
  beforeEach(() => {
    render(<Settings />);
  });

  it("devrait afficher le titre 'Paramètres du compte'", () => {
    expect(screen.getByText('Paramètres du compte')).toBeInTheDocument();
  });

  it('devrait afficher la case à cocher pour les notifications', () => {
    expect(screen.getByLabelText('Activer les notifications')).toBeInTheDocument();
  });

  it('devrait afficher la case à cocher pour le thème sombre', () => {
    expect(screen.getByLabelText('Activer le thème sombre')).toBeInTheDocument();
  });

  it("devrait afficher le bouton 'Enregistrer les modifications'", () => {
    expect(screen.getByRole('button', { name: 'Enregistrer les modifications' })).toBeInTheDocument();
  });
}); 