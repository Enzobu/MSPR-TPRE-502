import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ContinentBarChart from './ContinentBarChart';

// Mock de Chart.js
vi.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="bar-chart">Graphique en barres</div>
}));

describe('ContinentBarChart', () => {
  it('affiche le graphique des continents', () => {
    const mockData = {
      labels: ['Europe', 'Asia'],
      datasets: [{
        label: 'Cas par continent',
        data: [100, 200]
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
          text: 'Cas par continent'
        }
      }
    };
    
    render(<ContinentBarChart data={mockData} options={mockOptions} />);
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('affiche le titre du graphique des continents', () => {
    const mockData = {
      labels: ['Europe', 'Asia', 'America'],
      datasets: [{
        label: 'Cas par continent',
        data: [100, 200, 150]
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
    
    render(<ContinentBarChart data={mockData} options={mockOptions} />);
    expect(screen.getByText('Continents les plus touchés')).toBeInTheDocument();
  });
}); 