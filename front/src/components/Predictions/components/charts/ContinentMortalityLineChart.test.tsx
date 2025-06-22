import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ContinentMortalityLineChart from './ContinentMortalityLineChart';

// Mock de Chart.js
vi.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="line-chart">Graphique linéaire</div>
}));

describe('ContinentMortalityLineChart', () => {
  it('affiche le graphique de mortalité par continent', () => {
    const mockData = {
      labels: ['Jan', 'Fév', 'Mar'],
      datasets: [{
        label: 'Taux de mortalité',
        data: [2.5, 3.1, 2.8]
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
          text: 'Taux de mortalité par continent'
        }
      }
    };
    
    render(<ContinentMortalityLineChart data={mockData} options={mockOptions} />);
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByText('Taux de mortalité par continent')).toBeInTheDocument();
  });
}); 