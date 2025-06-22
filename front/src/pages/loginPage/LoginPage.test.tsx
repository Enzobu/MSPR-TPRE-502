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

    it('devrait afficher le logo Analyze It', () => {
      expect(screen.getByAltText('Analyze it logo')).toBeInTheDocument();
    });

    it('devrait afficher l\'image de fond WHO', () => {
      expect(screen.getByAltText('Who background image')).toBeInTheDocument();
    });

    it('devrait avoir la structure de page correcte', () => {
      const wrapper = screen.getByText('Welcome back').closest('.loginPageWrapper');
      expect(wrapper).toBeInTheDocument();
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

    it('devrait afficher le composant d\'enregistrement', () => {
      // Vérifier que le composant d'enregistrement est affiché
      expect(screen.getByText('Getting started now')).toBeInTheDocument();
    });
  });

  describe('navigation entre les formulaires', () => {
    it('devrait basculer de login vers register', () => {
      fireEvent.click(screen.getByText('Register'));
      expect(screen.getByText('Getting started now')).toBeInTheDocument();
    });

    it('devrait basculer de register vers login', () => {
      fireEvent.click(screen.getByText('Register'));
      fireEvent.click(screen.getByText('Log in'));
      expect(screen.getByText('Welcome back')).toBeInTheDocument();
    });
  });
}); 