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
}); 