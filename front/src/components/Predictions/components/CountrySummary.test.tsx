import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CountrySummary from './CountrySummary';
import type { Country } from '@/types/types';


// Mock de React pour éviter les erreurs de hooks
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useRef: vi.fn(() => ({ current: null })),
    useEffect: vi.fn()
  };
});

// Mock des traductions
vi.mock('../../../../data/countryTranslations', () => ({
  countryTranslations: {
    'germany': 'Allemagne',
    'spain': 'Espagne',
    'france': 'France'
  }
}));

describe('CountrySummary', () => {
  const mockCountry: Country = {
    id_country: 1,
    name: 'Germany',
    iso_code: 'DEU',
    population: '83000000',
    pib: '4000000000000',
    latitude: '51.17',
    longitude: '10.45',
    id_continent: 1,
    id_region: 1
  };

  const mockCountrySpain: Country = {
    id_country: 2,
    name: 'Spain',
    iso_code: 'ESP',
    population: '47000000',
    pib: '1500000000000',
    latitude: '40.46',
    longitude: '-3.75',
    id_continent: 1,
    id_region: 1
  };

  it('affiche les informations du pays', () => {
    render(<CountrySummary country={mockCountry} />);
    
    expect(screen.getByText('Allemagne')).toBeInTheDocument();
    expect(screen.getByText('83 000 000')).toBeInTheDocument();
    expect(screen.getByText('4,0 Bn $US')).toBeInTheDocument();
    expect(screen.getByText('51.17°')).toBeInTheDocument();
    expect(screen.getByText('10.45°')).toBeInTheDocument();
    expect(screen.getByText('DEU')).toBeInTheDocument();
  });

  it('affiche les données démographiques du pays', () => {
    render(<CountrySummary country={mockCountrySpain} />);
    
    expect(screen.getByText('Espagne')).toBeInTheDocument();
    expect(screen.getByText('47 000 000')).toBeInTheDocument();
    expect(screen.getByText('1,5 Bn $US')).toBeInTheDocument();
    expect(screen.getByText('40.46°')).toBeInTheDocument();
    expect(screen.getByText('-3.75°')).toBeInTheDocument();
    expect(screen.getByText('ESP')).toBeInTheDocument();
  });

  it('affiche le drapeau du pays', () => {
    render(<CountrySummary country={mockCountry} />);
    
    const flagElement = screen.getByText('🇩🇪');
    expect(flagElement).toBeInTheDocument();
  });

  it('affiche les coordonnées géographiques', () => {
    render(<CountrySummary country={mockCountry} />);
    
    expect(screen.getByText('51.1700°N, 10.4500°E')).toBeInTheDocument();
  });

  it('affiche le badge "Pays"', () => {
    render(<CountrySummary country={mockCountry} />);
    
    expect(screen.getByText('Pays')).toBeInTheDocument();
  });

  it('affiche les icônes appropriées', () => {
    render(<CountrySummary country={mockCountry} />);
    
    // Vérifier que les icônes sont présentes (elles sont rendues comme des SVG)
    expect(screen.getByText('Population')).toBeInTheDocument();
    expect(screen.getByText('PIB')).toBeInTheDocument();
    expect(screen.getByText('Latitude')).toBeInTheDocument();
    expect(screen.getByText('Longitude')).toBeInTheDocument();
  });

  it('affiche les informations géographiques', () => {
    render(<CountrySummary country={mockCountry} />);
    
    expect(screen.getByText('Informations géographiques')).toBeInTheDocument();
    expect(screen.getByText('Coordonnées:')).toBeInTheDocument();
    expect(screen.getByText('Code ISO:')).toBeInTheDocument();
  });
}); 