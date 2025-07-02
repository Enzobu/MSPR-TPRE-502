import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CountrySummary from './CountrySummary';

// Mock de React pour éviter les erreurs de hooks
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useRef: vi.fn(() => ({ current: null })),
    useEffect: vi.fn()
  };
});

describe('CountrySummary', () => {
  it('affiche le résumé du pays', () => {
    const mockCountry = {
      id: 1,
      id_country: 1,
      name: 'France',
      iso_code: 'FRA',
      population: '67000000',
      pib: '3000000000000',
      continent: 'Europe',
      capital: 'Paris',
      area: '551695',
      density: '121',
      latitude: '46.2276',
      longitude: '2.2137',
      id_continent: 1,
      id_region: 1
    };
    
    render(<CountrySummary country={mockCountry} />);
    expect(screen.getByText('France')).toBeInTheDocument();
  });

  it('affiche les informations détaillées du pays', () => {
    const mockCountry = {
      id: 2,
      id_country: 2,
      name: 'Allemagne',
      iso_code: 'DEU',
      population: '83000000',
      pib: '4000000000000',
      continent: 'Europe',
      capital: 'Berlin',
      area: '357022',
      density: '232',
      latitude: '51.1657',
      longitude: '10.4515',
      id_continent: 1,
      id_region: 1
    };
    
    render(<CountrySummary country={mockCountry} />);
    expect(screen.getByText('Allemagne')).toBeInTheDocument();
    expect(screen.getByText('83 000 000')).toBeInTheDocument();
  });

  it('affiche les données démographiques du pays', () => {
    const mockCountry = {
      id: 3,
      id_country: 3,
      name: 'Espagne',
      iso_code: 'ESP',
      population: '47000000',
      pib: '1500000000000',
      continent: 'Europe',
      capital: 'Madrid',
      area: '505990',
      density: '93',
      latitude: '40.4637',
      longitude: '-3.7492',
      id_continent: 1,
      id_region: 1
    };
    
    render(<CountrySummary country={mockCountry} />);
    expect(screen.getByText('Espagne')).toBeInTheDocument();
    expect(screen.getByText('47 000 000')).toBeInTheDocument();
  });
}); 