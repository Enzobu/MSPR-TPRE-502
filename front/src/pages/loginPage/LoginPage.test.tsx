import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '../../test-utils';
import LoginPage from './LoginPage';

describe('LoginPage', () => {
  beforeEach(() => {
    render(<LoginPage />);
  });

  describe('quand le formulaire de connexion est affiché', () => {
    it("devrait afficher le titre 'Welcome back'", () => {
      expect(screen.getByText('Welcome back')).toBeInTheDocument();
    });

    it("devrait afficher un lien pour basculer vers l'enregistrement", () => {
      expect(screen.getByText('Register')).toBeInTheDocument();
    });

    it('devrait afficher le composant de connexion', () => {
      // On vérifie la présence d'un élément spécifique au formulaire de connexion
      expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
    });
  });

  describe("quand l'utilisateur bascule vers le formulaire d'enregistrement", () => {
    beforeEach(() => {
      fireEvent.click(screen.getByText('Register'));
    });

    it("devrait afficher le titre 'Getting started now'", () => {
      expect(screen.getByText('Getting started now')).toBeInTheDocument();
    });

    it('devrait afficher un lien pour basculer vers la connexion', () => {
      expect(screen.getByText('Log in')).toBeInTheDocument();
    });
  });
}); 