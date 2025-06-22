import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CountryMortalityLineChart from './CountryMortalityLineChart';

// Mock de Chart.js
vi.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="line-chart">Graphique linéaire</div>
}));

describe('CountryMortalityLineChart', () => {
  it('affiche le graphique de mortalité pour un pays', () => {
    const mockData = {
      labels: ['Jan', 'Fév', 'Mar'],
      datasets: [{
        label: 'Taux de mortalité',
        data: [1.2, 1.5, 1.3]
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
          text: 'Taux de mortalité France'
        }
      }
    };
    
    render(<CountryMortalityLineChart data={mockData} options={mockOptions} countryName="France" />);
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByText('Taux de mortalité France')).toBeInTheDocument();
  });

  it('affiche le nom du pays dans le titre', () => {
    const mockData = {
      labels: ['Jan', 'Fév'],
      datasets: [{
        label: 'Taux de mortalité',
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
    
    render(<CountryMortalityLineChart data={mockData} options={mockOptions} countryName="Allemagne" />);
    expect(screen.getByText('Taux de mortalité Allemagne')).toBeInTheDocument();
  });
}); 