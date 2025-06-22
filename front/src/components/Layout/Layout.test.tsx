import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '../../test-utils';
import Layout from './Layout';

describe('Layout', () => {
  beforeEach(() => {
    render(
      <Layout>
        <p>Contenu enfant</p>
      </Layout>
    );
  });

  it('devrait afficher la barre de navigation', () => {
    // On vérifie un élément clé de la Navbar pour confirmer sa présence
    expect(screen.getByRole('link', { name: /accueil/i })).toBeInTheDocument();
  });

  it('devrait afficher le contenu enfant passé au composant', () => {
    expect(screen.getByText('Contenu enfant')).toBeInTheDocument();
  });

  it('devrait avoir la structure correcte avec main et role', () => {
    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toHaveAttribute('id', 'main-content');
  });

  it('devrait afficher plusieurs éléments enfants', () => {
    render(
      <Layout>
        <h1>Titre principal</h1>
        <p>Paragraphe de contenu</p>
        <button>Bouton d'action</button>
      </Layout>
    );
    
    expect(screen.getByText('Titre principal')).toBeInTheDocument();
    expect(screen.getByText('Paragraphe de contenu')).toBeInTheDocument();
    expect(screen.getByText('Bouton d\'action')).toBeInTheDocument();
  });
}); 