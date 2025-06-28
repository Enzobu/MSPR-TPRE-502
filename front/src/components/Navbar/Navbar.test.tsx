import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '../../test-utils';
import Navbar from './Navbar';

describe('Navbar', () => {
  beforeEach(() => {
    render(<Navbar />);
  });

  it("devrait afficher le logo et le nom du site", () => {
    expect(screen.getByText('AnalyzeIt')).toBeInTheDocument();
    expect(screen.getByAltText('WHO Logo')).toBeInTheDocument();
  });

  it("devrait afficher le lien 'Accueil'", () => {
    // Il y a deux liens "Accueil" (desktop et mobile), on vérifie qu'au moins un existe
    expect(screen.getAllByRole('link', { name: 'Accueil' })).toHaveLength(2);
  });

  it("devrait afficher le lien 'Prédictions'", () => {
    // Il y a deux liens "Prédictions" (desktop et mobile), on vérifie qu'au moins un existe
    expect(screen.getAllByRole('link', { name: 'Prédictions' })).toHaveLength(2);
  });

  it("devrait afficher le lien 'Connexion' quand l'utilisateur n'est pas authentifié", () => {
    expect(screen.getByRole('link', { name: 'Connexion' })).toBeInTheDocument();
  });

  it("devrait avoir la structure de navigation correcte", () => {
    const navElements = screen.getAllByRole('navigation');
    expect(navElements).toHaveLength(2); // Navigation desktop et mobile
  });

  it("devrait afficher le badge WHO", () => {
    expect(screen.getByText('WHO')).toBeInTheDocument();
  });

  it("devrait avoir le bouton de changement de thème", () => {
    expect(screen.getByRole('button', { name: 'Changer le thème' })).toBeInTheDocument();
  });
}); 