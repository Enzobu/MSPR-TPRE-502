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
}); 