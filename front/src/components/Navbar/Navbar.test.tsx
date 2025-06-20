import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '../../test-utils';
import Navbar from './Navbar';

describe('Navbar', () => {
  beforeEach(() => {
    render(<Navbar />);
  });

  it("devrait afficher le logo et le nom du site", () => {
    expect(screen.getByText('Analyze It')).toBeInTheDocument();
    expect(screen.getByAltText('Analyze It')).toBeInTheDocument();
  });

  it("devrait afficher le lien 'Accueil'", () => {
    expect(screen.getByRole('link', { name: 'Accueil' })).toBeInTheDocument();
  });

  it("devrait afficher le lien 'Compte'", () => {
    expect(screen.getByRole('link', { name: 'Compte' })).toBeInTheDocument();
  });

  it("devrait afficher le bouton 'Déconnexion'", () => {
    expect(screen.getByRole('button', { name: 'Déconnexion' })).toBeInTheDocument();
  });
}); 