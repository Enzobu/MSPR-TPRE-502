import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../../test-utils';
import Predictions from './Predictions';

// Mock des données de prédictions
vi.mock('./hooks/usePredictions', () => ({
  usePredictions: vi.fn(() => ({
    predictions: [],
    loading: false,
    error: null,
    fetchPredictions: vi.fn(),
  })),
}));

// Mock des données de pays
vi.mock('./hooks/useCountries', () => ({
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

describe('Predictions', () => {
  beforeEach(() => {
    render(<Predictions />);
  });

  it('devrait afficher le champ pour la date de début', () => {
    expect(screen.getByText('Date de début:')).toBeInTheDocument();
  });

  it('devrait afficher le champ pour la date de fin', () => {
    expect(screen.getByText('Date de fin:')).toBeInTheDocument();
  });

  it('devrait afficher la sélection du pays', () => {
    expect(screen.getByText('Pays:')).toBeInTheDocument();
  });

  it("devrait afficher le bouton 'Afficher les prédictions'", () => {
    expect(screen.getByRole('button', { name: /afficher les prédictions/i })).toBeInTheDocument();
  });
}); 