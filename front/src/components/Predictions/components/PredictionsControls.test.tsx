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
}); 