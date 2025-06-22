import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import PredictionsControls from './PredictionsControls';

// Mock de React pour éviter les erreurs de hooks
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useState: vi.fn(() => ['', vi.fn()]),
    useEffect: vi.fn()
  };
});

describe('PredictionsControls', () => {
  it('affiche les contrôles des prédictions', () => {
    const mockSetStartDate = vi.fn();
    const mockSetEndDate = vi.fn();
    const mockSetSelectedCountry = vi.fn();
    const mockOnFetch = vi.fn();
    
    render(
      <PredictionsControls 
        startDate=""
        endDate=""
        setStartDate={mockSetStartDate}
        setEndDate={mockSetEndDate}
        selectedCountry={null}
        setSelectedCountry={mockSetSelectedCountry}
        countries={[]}
        onFetch={mockOnFetch}
        disabled={false}
      />
    );
    expect(screen.getByText('Sélectionnez un pays')).toBeInTheDocument();
  });

  it('affiche les contrôles avec des pays disponibles', () => {
    const mockSetStartDate = vi.fn();
    const mockSetEndDate = vi.fn();
    const mockSetSelectedCountry = vi.fn();
    const mockOnFetch = vi.fn();
    
    const mockCountries = [
      { 
        id_country: 1, 
        name: 'France',
        iso_code: 'FRA',
        population: '67000000',
        pib: '3000000000000',
        latitude: '46.2276',
        longitude: '2.2137',
        id_continent: 1,
        id_region: 1
      },
      { 
        id_country: 2, 
        name: 'Allemagne',
        iso_code: 'DEU',
        population: '83000000',
        pib: '4000000000000',
        latitude: '51.1657',
        longitude: '10.4515',
        id_continent: 1,
        id_region: 1
      },
      { 
        id_country: 3, 
        name: 'Espagne',
        iso_code: 'ESP',
        population: '47000000',
        pib: '1500000000000',
        latitude: '40.4637',
        longitude: '-3.7492',
        id_continent: 1,
        id_region: 1
      }
    ];
    
    render(
      <PredictionsControls 
        startDate="2024-01-01"
        endDate="2024-12-31"
        setStartDate={mockSetStartDate}
        setEndDate={mockSetEndDate}
        selectedCountry={null}
        setSelectedCountry={mockSetSelectedCountry}
        countries={mockCountries}
        onFetch={mockOnFetch}
        disabled={false}
      />
    );
    expect(screen.getByText('Sélectionnez un pays')).toBeInTheDocument();
  });

  it('affiche les contrôles en état désactivé', () => {
    const mockSetStartDate = vi.fn();
    const mockSetEndDate = vi.fn();
    const mockSetSelectedCountry = vi.fn();
    const mockOnFetch = vi.fn();
    
    render(
      <PredictionsControls 
        startDate=""
        endDate=""
        setStartDate={mockSetStartDate}
        setEndDate={mockSetEndDate}
        selectedCountry={null}
        setSelectedCountry={mockSetSelectedCountry}
        countries={[]}
        onFetch={mockOnFetch}
        disabled={true}
      />
    );
    expect(screen.getByText('Sélectionnez un pays')).toBeInTheDocument();
  });
}); 