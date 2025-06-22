import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CountryRecoveryLineChart from './CountryRecoveryLineChart';

// Mock de Chart.js
vi.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="line-chart">Graphique linéaire</div>
}));

describe('CountryRecoveryLineChart', () => {
  it('affiche le graphique de rétablissement pour un pays', () => {
    const mockData = {
      labels: ['Jan', 'Fév', 'Mar'],
      datasets: [{
        label: 'Taux de rétablissement',
        data: [85.2, 87.5, 89.3]
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
          text: 'Taux de rétablissement France'
        }
      }
    };
    
    render(<CountryRecoveryLineChart data={mockData} options={mockOptions} countryName="France" />);
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByText('Taux de rétablissement France')).toBeInTheDocument();
  });

  it('affiche le nom du pays dans le titre de rétablissement', () => {
    const mockData = {
      labels: ['Jan', 'Fév'],
      datasets: [{
        label: 'Taux de rétablissement',
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
    
    render(<CountryRecoveryLineChart data={mockData} options={mockOptions} countryName="Espagne" />);
    expect(screen.getByText('Taux de rétablissement Espagne')).toBeInTheDocument();
  });
}); 