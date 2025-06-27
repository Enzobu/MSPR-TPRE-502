import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../../test-utils';
import HomePage from './HomePage';

vi.mock('../../components/Predictions/hooks/usePredictions', () => ({
  usePredictions: vi.fn(() => ({
    predictions: [],
    loading: false,
    error: null,
    fetchPredictions: vi.fn(),
  })),
}));

vi.mock('../../components/Predictions/hooks/useCountries', () => ({
  useCountries: vi.fn(() => ({
    countries: [
      {
        id_country: 1,
        name: 'France',
        population: '65000000',
        id_continent: 1,
      },
    ],
    loading: false,
    error: null,
  })),
}));

describe('HomePage', () => {
  beforeEach(() => {
    render(<HomePage />);
  });

  it("devrait afficher le titre principal 'AnalyzeIt'", () => {
    expect(screen.getByRole('heading', { name: /analyzeit prédictions santé/i })).toBeInTheDocument();
  });

  it("devrait afficher le premier lien de navigation 'Accueil'", () => {
    const accueilLinks = screen.getAllByRole('link', { name: /accueil/i });
    expect(accueilLinks.length).toBeGreaterThan(0); // Vérifie qu'il y a au moins un lien Accueil
    expect(accueilLinks[0]).toBeInTheDocument();
  });

  it("devrait afficher le lien 'Mon compte'", () => {
    expect(screen.getByRole('link', { name: /mon compte/i })).toBeInTheDocument();
  });

  it("devrait afficher le bouton de changement de thème", () => {
    expect(screen.getByRole('button', { name: /changer le thème/i })).toBeInTheDocument();
  });

  it("devrait avoir la structure de page correcte avec le logo WHO", () => {
    expect(screen.getByAltText('WHO Logo')).toBeInTheDocument();
  });

  it("devrait afficher les fonctionnalités principales", () => {
    expect(screen.getByText('Fonctionnalités Principales')).toBeInTheDocument();
  });

  it("devrait avoir le titre principal en tant qu'élément h1", () => {
    const titleElements = screen.getAllByRole('heading', { level: 1 });
    const mainTitle = titleElements.find(el => el.textContent?.includes('AnalyzeIt'));
    expect(mainTitle).toBeInTheDocument();
    expect(mainTitle).toHaveTextContent('AnalyzeIt');
  });
}); 