import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Predictions from './Predictions';

// Mock de React pour éviter les erreurs de hooks
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useRef: vi.fn(() => ({ current: null })),
    useState: vi.fn(() => ['', vi.fn()]),
    useEffect: vi.fn()
  };
});

// Mock des hooks d'authentification
vi.mock('react-auth-kit/hooks/useAuthHeader', () => ({
  default: () => 'Bearer mock-token'
}));

// Mock des données de prédictions
vi.mock('../../hooks/usePredictions', () => ({
  default: () => ({
    predictions: [
      {
        id: 1,
        id_country: 1,
        date: '2024-01-01',
        cases: 100,
        deaths: 10,
        recoveries: 80
      }
    ],
    loading: false,
    error: null
  })
}));

// Mock des données de pays
vi.mock('../../hooks/useCountries', () => ({
  default: () => ({
    countries: [
      {
        id: 1,
        name: 'France',
        continent: 'Europe'
      }
    ],
    loading: false,
    error: null
  })
}));

// Mock des continents
vi.mock('../../data/continents', () => ({
  continents: [
    { id: 1, name: 'Europe' },
    { id: 2, name: 'Asia' }
  ]
}));

// Mock des fonctions utilitaires
vi.mock('../../utils/countryUtils', () => ({
  getCountriesByContinent: () => [1, 2, 3]
}));

describe('Predictions', () => {
  it('affiche le composant de prédictions', () => {
    render(<Predictions />);
    expect(screen.getByText('Prédictions')).toBeInTheDocument();
  });
}); 