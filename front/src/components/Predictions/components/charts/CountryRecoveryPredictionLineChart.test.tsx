import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CountryRecoveryPredictionLineChart from './CountryRecoveryPredictionLineChart';

// Mock de Chart.js
vi.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="line-chart">Graphique linéaire</div>
}));

describe('CountryRecoveryPredictionLineChart', () => {
  it('affiche le graphique de prédiction de rétablissement pour un pays', () => {
    const mockData = {
      labels: ['Jan', 'Fév', 'Mar', 'Avr'],
      datasets: [{
        label: 'Prédiction taux de rétablissement',
        data: [85.2, 87.5, 89.3, 91.1]
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
          text: 'Prédiction du taux de rétablissement France'
        }
      }
    };
    
    render(<CountryRecoveryPredictionLineChart data={mockData} options={mockOptions} countryName="France" />);
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByText('Prédiction du taux de rétablissement France')).toBeInTheDocument();
  });

  it('affiche le nom du pays dans le titre de prédiction de rétablissement', () => {
    const mockData = {
      labels: ['Jan', 'Fév'],
      datasets: [{
        label: 'Prédiction taux de rétablissement',
        data: [85.2, 87.5]
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
    
    render(<CountryRecoveryPredictionLineChart data={mockData} options={mockOptions} countryName="Portugal" />);
    expect(screen.getByText('Prédiction du taux de rétablissement Portugal')).toBeInTheDocument();
  });
}); 