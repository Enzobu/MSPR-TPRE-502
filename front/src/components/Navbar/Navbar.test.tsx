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

  it("devrait avoir la structure de navigation correcte", () => {
    const navElement = screen.getByRole('navigation');
    expect(navElement).toBeInTheDocument();
    expect(navElement).toHaveAttribute('aria-label', 'Navigation principale');
  });

  it("devrait avoir les liens avec les bonnes classes CSS", () => {
    const accueilLink = screen.getByRole('link', { name: 'Accueil' });
    const compteLink = screen.getByRole('link', { name: 'Compte' });
    
    expect(accueilLink).toHaveClass('nav-link');
    expect(compteLink).toHaveClass('nav-link');
  });

  it("devrait avoir le bouton de déconnexion avec les bons attributs", () => {
    const logoutButton = screen.getByRole('button', { name: 'Déconnexion' });
    expect(logoutButton).toHaveClass('nav-link', 'logout-button');
    expect(logoutButton).toHaveAttribute('type', 'button');
    expect(logoutButton).toHaveAttribute('aria-label', 'Déconnexion');
  });
}); 