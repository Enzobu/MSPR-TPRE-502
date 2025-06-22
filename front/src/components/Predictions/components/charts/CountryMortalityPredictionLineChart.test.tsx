import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CountryMortalityPredictionLineChart from './CountryMortalityPredictionLineChart';

// Mock de Chart.js
vi.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="line-chart">Graphique linéaire</div>
}));

describe('CountryMortalityPredictionLineChart', () => {
  it('affiche le graphique de prédiction de mortalité pour un pays', () => {
    const mockData = {
      labels: ['Jan', 'Fév', 'Mar', 'Avr'],
      datasets: [{
        label: 'Prédiction taux de mortalité',
        data: [1.2, 1.5, 1.3, 1.4]
      }]
    };
    
    const mockOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: 'Prédiction du taux de mortalité France'
        }
      }
    };
    
    render(<CountryMortalityPredictionLineChart data={mockData} options={mockOptions} countryName="France" />);
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByText('Prédiction du taux de mortalité France')).toBeInTheDocument();
  });

  it('affiche le nom du pays dans le titre de prédiction', () => {
    const mockData = {
      labels: ['Jan', 'Fév'],
      datasets: [{
        label: 'Prédiction taux de mortalité',
        data: [1.2, 1.5]
      }]
    };
    
    const mockOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        }
      }
    };
    
    render(<CountryMortalityPredictionLineChart data={mockData} options={mockOptions} countryName="Italie" />);
    expect(screen.getByText('Prédiction du taux de mortalité Italie')).toBeInTheDocument();
  });
}); 