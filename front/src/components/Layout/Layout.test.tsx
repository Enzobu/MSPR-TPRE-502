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
    // On vérifie qu'il y a bien les liens "Accueil" de la Navbar (desktop + mobile)
    expect(screen.getAllByRole('link', { name: /accueil/i })).toHaveLength(2);
  });

  it('devrait afficher le contenu enfant passé au composant', () => {
    expect(screen.getByText('Contenu enfant')).toBeInTheDocument();
  });

  it('devrait avoir la structure correcte avec main element', () => {
    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toHaveClass('container', 'mx-auto', 'px-4', 'py-8');
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