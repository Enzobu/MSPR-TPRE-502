import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PredictionsControls from './TransmissionControls';
import type { Country } from '../../../types/types';

// Mock des traductions
vi.mock('../../../data/countryTranslations', () => ({
  countryTranslations: {
    'france': 'France',
    'germany': 'Allemagne',
    'spain': 'Espagne'
  }
}));

// Mock du utility capitalize
vi.mock('../utils/capitalize', () => ({
  capitalize: (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
}));

// Mock de date-fns
vi.mock('date-fns', () => ({
  format: vi.fn((date: Date, formatStr: string) => {
    if (formatStr === 'dd/MM/yyyy') {
      return date.toLocaleDateString('fr-FR');
    }
    return date.toISOString().split('T')[0];
  }),
  addDays: vi.fn((date: Date, days: number) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  })
}));

// Mock de date-fns/locale
vi.mock('date-fns/locale', () => ({
  fr: {}
}));

// Mock de lucide-react
vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('lucide-react')>();
  return {
    ...actual,
    Calendar: ({ className }: any) => <span className={className} data-testid="calendar-icon">📅</span>,
    MapPin: ({ className }: any) => <span className={className} data-testid="mappin-icon">📍</span>
  };
});

// Mock du utility cn
vi.mock('@/lib/utils', () => ({
  cn: vi.fn((...classes) => classes.filter(Boolean).join(' '))
}));

describe('PredictionsControls', () => {
  const mockCountries: Country[] = [
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
      name: 'Germany', 
      iso_code: 'DEU', 
      population: '83000000', 
      pib: '4000000000000', 
      latitude: '51.1657', 
      longitude: '10.4515', 
      id_continent: 1, 
      id_region: 1 
    }
  ];

  const defaultProps = {
    startDate: '',
    endDate: '',
    setStartDate: vi.fn(),
    setEndDate: vi.fn(),
    selectedCountry: null,
    setSelectedCountry: vi.fn(),
    countries: mockCountries,
    onFetch: vi.fn(),
    disabled: false
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait rendre le composant avec le titre correct', () => {
    render(<PredictionsControls {...defaultProps} />);
    
    expect(screen.getByText('Paramètres de prédiction')).toBeInTheDocument();
    expect(screen.getByText('Sélectionnez une période et un pays pour générer des prédictions')).toBeInTheDocument();
  });

  it('devrait afficher les labels des sélecteurs', () => {
    render(<PredictionsControls {...defaultProps} />);
    
    expect(screen.getByText('Date de début')).toBeInTheDocument();
    expect(screen.getByText('Date de fin')).toBeInTheDocument();
    expect(screen.getByText('Pays')).toBeInTheDocument();
  });

  it('devrait afficher les placeholders corrects', () => {
    render(<PredictionsControls {...defaultProps} />);
    
    expect(screen.getByText('Sélectionner la date de début')).toBeInTheDocument();
    expect(screen.getByText('Sélectionner la date de fin')).toBeInTheDocument();
    expect(screen.getByText('Sélectionnez un pays')).toBeInTheDocument();
  });

  it('devrait afficher les icônes', () => {
    render(<PredictionsControls {...defaultProps} />);
    
    expect(screen.getAllByTestId('calendar-icon').length).toBeGreaterThan(0); // Il y a plusieurs icônes Calendar
    expect(screen.getByTestId('mappin-icon')).toBeInTheDocument();
  });

  it('devrait afficher le bouton avec le texte correct quand non disabled', () => {
    render(<PredictionsControls {...defaultProps} />);
    
    const button = screen.getByRole('button', { name: /afficher les prédictions/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled(); // Désactivé car aucune donnée sélectionnée
  });

  it('devrait afficher le texte de chargement quand disabled', () => {
    render(<PredictionsControls {...defaultProps} disabled={true} />);
    
    expect(screen.getByText('Chargement...')).toBeInTheDocument();
  });

  it('devrait avoir le bouton activé avec des données complètes', () => {
    const props = {
      ...defaultProps,
      startDate: '2024-01-01',
      endDate: '2024-01-02',
      selectedCountry: 1
    };

    render(<PredictionsControls {...props} />);
    
    const button = screen.getByRole('button', { name: /afficher les prédictions/i });
    expect(button).not.toBeDisabled();
  });

  it('devrait appeler onFetch avec les bonnes données', () => {
    const props = {
      ...defaultProps,
      startDate: '2024-01-01',
      endDate: '2024-01-02',
      selectedCountry: 1
    };

    render(<PredictionsControls {...props} />);
    
    const button = screen.getByRole('button', { name: /afficher les prédictions/i });
    fireEvent.click(button);
    
    expect(props.onFetch).toHaveBeenCalledWith('2024-01-01', '2024-01-02', 1);
  });

  it('devrait afficher les messages de validation des dates', () => {
    render(<PredictionsControls {...defaultProps} />);
    
    expect(screen.getByText(/Minimum :/)).toBeInTheDocument();
    expect(screen.getByText("Veuillez d'abord sélectionner une date de début")).toBeInTheDocument();
  });

  it('devrait afficher le message de validation pour la date de fin avec startDate', () => {
    const props = {
      ...defaultProps,
      startDate: '2024-01-01'
    };

    render(<PredictionsControls {...props} />);
    
    expect(screen.getByText(/Maximum :/)).toBeInTheDocument();
    expect(screen.getByText(/90 jours/)).toBeInTheDocument();
  });

  it('devrait désactiver la date de fin quand aucune date de début', () => {
    render(<PredictionsControls {...defaultProps} />);
    
    const endDateButton = screen.getAllByRole('button').find(button => 
      button.textContent?.includes('Sélectionner la date de fin')
    );
    expect(endDateButton).toBeDisabled();
  });
});