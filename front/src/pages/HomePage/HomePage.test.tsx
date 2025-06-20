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

  it("devrait afficher le titre 'Tableau de bord'", () => {
    expect(screen.getByText('Tableau de bord')).toBeInTheDocument();
  });

  it("devrait afficher le lien de navigation 'Accueil'", () => {
    expect(screen.getByRole('link', { name: /accueil/i })).toBeInTheDocument();
  });

  it("devrait afficher le lien de navigation 'Compte'", () => {
    expect(screen.getByRole('link', { name: /compte/i })).toBeInTheDocument();
  });

  it("devrait afficher le bouton de déconnexion", () => {
    expect(screen.getByRole('button', { name: /déconnexion/i })).toBeInTheDocument();
  });
}); 