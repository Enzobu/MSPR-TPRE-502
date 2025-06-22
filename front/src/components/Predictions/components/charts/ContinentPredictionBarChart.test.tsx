import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ContinentPredictionBarChart from './ContinentPredictionBarChart';

// Mock de Chart.js
vi.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="bar-chart">Graphique en barres</div>
}));

describe('ContinentPredictionBarChart', () => {
  it('affiche le graphique de prédiction des continents', () => {
    const mockData = {
      labels: ['Europe', 'Asia', 'America'],
      datasets: [{
        label: 'Prédiction cas par continent',
        data: [150, 250, 180]
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
          text: 'Prédiction des continents les plus touchés'
        }
      }
    };
    
    render(<ContinentPredictionBarChart data={mockData} options={mockOptions} />);
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByText('Prédiction des continents les plus touchés')).toBeInTheDocument();
  });
}); 