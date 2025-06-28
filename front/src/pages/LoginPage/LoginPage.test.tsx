import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '../../test-utils';
import LoginPage from './LoginPage';

describe('LoginPage', () => {
  beforeEach(() => {
    render(<LoginPage />);
  });

  describe('éléments de la page de connexion', () => {
    it('devrait afficher le titre AnalyzeIt', () => {
      expect(screen.getByText('AnalyzeIt')).toBeInTheDocument();
    });

    it('devrait afficher le badge WHO Platform', () => {
      expect(screen.getByText('WHO Platform')).toBeInTheDocument();
    });

    it('devrait afficher la description de la plateforme', () => {
      expect(screen.getByText('Plateforme d\'analyse prédictive en santé publique')).toBeInTheDocument();
    });

    it('devrait afficher le titre Connexion', () => {
      expect(screen.getByText('Connexion')).toBeInTheDocument();
    });

    it('devrait afficher la description de connexion', () => {
      expect(screen.getByText('Accédez à votre compte pour utiliser les outils d\'analyse')).toBeInTheDocument();
    });

    it('devrait afficher le logo WHO', () => {
      expect(screen.getByAltText('WHO Logo')).toBeInTheDocument();
    });

    it('devrait afficher le lien de retour à l\'accueil', () => {
      expect(screen.getByText('Retour à l\'accueil')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /retour à l'accueil/i })).toHaveAttribute('href', '/');
    });

    it('devrait afficher le copyright', () => {
      expect(screen.getByText('© 2024 AnalyzeIt - World Health Organization')).toBeInTheDocument();
    });
  });

  describe('formulaire de connexion', () => {
    it('devrait afficher le champ email', () => {
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText('votre.email@example.com')).toBeInTheDocument();
    });

    it('devrait afficher le champ mot de passe', () => {
      expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    });

    it('devrait afficher le bouton de connexion', () => {
      expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
    });

    it('devrait afficher le message d\'instruction WHO', () => {
      expect(screen.getByText('Utilisez vos identifiants WHO pour accéder à la plateforme')).toBeInTheDocument();
    });
  });

  describe('structure et accessibilité', () => {
    it('devrait avoir un formulaire avec les champs requis', () => {
      const form = document.querySelector('form');
      expect(form).toBeInTheDocument();
    });

    it('devrait avoir les champs correctement étiquetés', () => {
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/mot de passe/i);
      
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });
}); 