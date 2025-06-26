import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PredictionsControls from './PredictionsControls';
import type { Country } from '../../../../types/types';

// Mock des traductions
vi.mock('../../../../data/countryTranslations', () => ({
  countryTranslations: {
    'france': 'France',
    'germany': 'Allemagne',
    'spain': 'Espagne'
  }
}));

// Mock des composants UI
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, ...props }: any) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  )
}));

vi.mock('@/components/ui/label', () => ({
  Label: ({ children, ...props }: any) => <label {...props}>{children}</label>
}));

vi.mock('@/components/ui/select', () => ({
  Select: ({ children, value, onValueChange, disabled }: any) => (
    <select value={value} onChange={(e) => onValueChange(Number(e.target.value))} disabled={disabled}>
      {children}
    </select>
  ),
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children, value }: any) => <option value={value}>{children}</option>,
  SelectTrigger: ({ children }: any) => <div>{children}</div>,
  SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>
}));

vi.mock('@/components/ui/calendar', () => ({
  Calendar: ({ selected, onSelect, disabled, ...props }: any) => (
    <div data-testid="calendar">
      <input
        type="date"
        value={selected ? selected.toISOString().split('T')[0] : ''}
        onChange={(e) => {
          if (onSelect) {
            const newDate = new Date(e.target.value);
            onSelect(newDate);
          }
        }}
        {...props}
      />
    </div>
  )
}));

vi.mock('@/components/ui/popover', () => ({
  Popover: ({ children }: any) => <div>{children}</div>,
  PopoverContent: ({ children }: any) => <div>{children}</div>,
  PopoverTrigger: ({ children, asChild }: any) => {
    if (asChild) {
      return children;
    }
    return <div>{children}</div>;
  }
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardDescription: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  CardHeader: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardTitle: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>
}));

// Mock de date-fns
vi.mock('date-fns', () => ({
  format: (date: Date, formatStr: string) => {
    if (formatStr === 'dd/MM/yyyy') {
      return date.toLocaleDateString('fr-FR');
    }
    return date.toISOString().split('T')[0];
  },
  addDays: (date: Date, days: number) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  }
}));

// Mock de lucide-react
vi.mock('lucide-react', () => ({
  CalendarIcon: ({ className }: any) => <div className={className}>📅</div>,
  MapPin: ({ className }: any) => <div className={className}>📍</div>,
  Calendar: ({ className }: any) => <div className={className}>📅</div>
}));

describe('PredictionsControls', () => {
  const mockCountries: Country[] = [
    { id_country: 1, name: 'France', iso_code: 'FRA', population: 67000000, pib: 3000000000000, latitude: 46.2276, longitude: 2.2137, id_continent: 1, id_region: 1 },
    { id_country: 2, name: 'Germany', iso_code: 'DEU', population: 83000000, pib: 4000000000000, latitude: 51.1657, longitude: 10.4515, id_continent: 1, id_region: 1 }
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

  it('devrait afficher les sélecteurs de date', () => {
    render(<PredictionsControls {...defaultProps} />);
    
    expect(screen.getByText('Date de début')).toBeInTheDocument();
    expect(screen.getByText('Date de fin')).toBeInTheDocument();
  });

  it('devrait afficher le sélecteur de pays', () => {
    render(<PredictionsControls {...defaultProps} />);
    
    expect(screen.getByText('Pays')).toBeInTheDocument();
    expect(screen.getByText('Sélectionnez un pays')).toBeInTheDocument();
  });

  it('devrait afficher le bouton de validation', () => {
    render(<PredictionsControls {...defaultProps} />);
    
    expect(screen.getByText('Afficher les prédictions')).toBeInTheDocument();
  });

  it('devrait être désactivé quand disabled est true', () => {
    render(<PredictionsControls {...defaultProps} disabled={true} />);
    
    const button = screen.getByText('Chargement...');
    expect(button).toBeDisabled();
  });

  it('devrait afficher le texte de chargement quand disabled est true', () => {
    render(<PredictionsControls {...defaultProps} disabled={true} />);
    
    expect(screen.getByText('Chargement...')).toBeInTheDocument();
  });

  it('devrait appeler onFetch quand le bouton est cliqué avec des données valides', () => {
    const props = {
      ...defaultProps,
      startDate: '2024-01-01',
      endDate: '2024-01-02',
      selectedCountry: 1
    };

    render(<PredictionsControls {...props} />);
    
    const button = screen.getByText('Afficher les prédictions');
    fireEvent.click(button);
    
    expect(props.onFetch).toHaveBeenCalledWith('2024-01-01', '2024-01-02', 1);
  });

  it('ne devrait pas appeler onFetch quand les données sont incomplètes', () => {
    render(<PredictionsControls {...defaultProps} />);
    
    const button = screen.getByText('Afficher les prédictions');
    fireEvent.click(button);
    
    expect(defaultProps.onFetch).not.toHaveBeenCalled();
  });

  it('devrait afficher les pays dans le sélecteur', () => {
    render(<PredictionsControls {...defaultProps} />);
    
    expect(screen.getByText('France')).toBeInTheDocument();
    expect(screen.getByText('Allemagne')).toBeInTheDocument();
  });

  it('devrait appeler setSelectedCountry quand un pays est sélectionné', () => {
    render(<PredictionsControls {...defaultProps} />);
    
    const select = screen.getByDisplayValue('') || document.querySelector('select');
    fireEvent.change(select!, { target: { value: '1' } });
    
    expect(defaultProps.setSelectedCountry).toHaveBeenCalledWith(1);
  });

  it('devrait afficher les informations de validation des dates', () => {
    render(<PredictionsControls {...defaultProps} />);
    
    expect(screen.getByText(/Minimum :/)).toBeInTheDocument();
    expect(screen.getByText(/Veuillez d'abord sélectionner une date de début/)).toBeInTheDocument();
  });

  it('devrait afficher les informations de validation quand une date de début est sélectionnée', () => {
    const props = {
      ...defaultProps,
      startDate: '2024-01-01'
    };

    render(<PredictionsControls {...props} />);
    
    expect(screen.getByText(/Maximum :/)).toBeInTheDocument();
  });
}); 