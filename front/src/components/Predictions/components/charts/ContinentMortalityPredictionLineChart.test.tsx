import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ContinentMortalityPredictionLineChart from './ContinentMortalityPredictionLineChart';

// Mock de Chart.js
vi.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="line-chart">Graphique linéaire</div>
}));

describe('ContinentMortalityPredictionLineChart', () => {
  it('affiche le graphique de prédiction de mortalité par continent', () => {
    const mockData = {
      labels: ['Jan', 'Fév', 'Mar', 'Avr'],
      datasets: [{
        label: 'Prédiction taux de mortalité',
        data: [2.5, 3.1, 2.8, 2.9]
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
          text: 'Prédiction du taux de mortalité par continent'
        }
      }
    };
    
    render(<ContinentMortalityPredictionLineChart data={mockData} options={mockOptions} />);
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByText('Prédiction du taux de mortalité par continent')).toBeInTheDocument();
  });
}); 