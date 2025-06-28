import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MortalityRateChart from './MortalityRateChart';

// Mock de react-chartjs-2
vi.mock('react-chartjs-2', () => ({
  Line: ({ data, options }: any) => (
    <div data-testid="mortality-chart">
      <div data-testid="chart-data">{JSON.stringify(data)}</div>
      <div data-testid="chart-options">{JSON.stringify(options, (value) => 
        typeof value === 'function' ? '[Function]' : value
      )}</div>
    </div>
  )
}));

describe('MortalityRateChart', () => {
  const mockMortalityData = {
    country_id: "1",
    disease_id: "1",
    start_date: "2024-01-01",
    end_date: "2024-01-03",
    mortality_rate: [
      { "2024-01-01": 0.018808039797055132 } as { [date: string]: number },
      { "2024-01-02": 0.018808039797055132 } as { [date: string]: number },
      { "2024-01-03": 0.018808039797055132 } as { [date: string]: number }
    ]
  };

  const defaultProps = {
    mortalityData: mockMortalityData,
    countryName: 'France'
  };

  it('devrait rendre le composant', () => {
    render(<MortalityRateChart {...defaultProps} />);
    
    expect(screen.getByTestId('mortality-chart')).toBeInTheDocument();
  });

  it('devrait afficher les données du graphique', () => {
    render(<MortalityRateChart {...defaultProps} />);
    
    const chartData = JSON.parse(screen.getByTestId('chart-data').textContent || '{}');
    expect(chartData).toHaveProperty('labels');
    expect(chartData).toHaveProperty('datasets');
  });

  it('devrait avoir les bonnes étiquettes de dates', () => {
    render(<MortalityRateChart {...defaultProps} />);
    
    const chartData = JSON.parse(screen.getByTestId('chart-data').textContent || '{}');
    expect(chartData.labels).toEqual(['01/01/2024', '02/01/2024', '03/01/2024']);
  });

  it('devrait avoir deux datasets (historique et futur)', () => {
    render(<MortalityRateChart {...defaultProps} />);
    
    const chartData = JSON.parse(screen.getByTestId('chart-data').textContent || '{}');
    expect(chartData.datasets).toHaveLength(2);
  });

  it('devrait avoir le bon titre du graphique', () => {
    render(<MortalityRateChart {...defaultProps} />);
    
    const chartOptions = JSON.parse(screen.getByTestId('chart-options').textContent || '{}');
    expect(chartOptions.plugins.title.text).toBe('Évolution du taux de mortalité - France');
  });

  it('devrait avoir les bonnes couleurs pour les datasets', () => {
    render(<MortalityRateChart {...defaultProps} />);
    
    const chartData = JSON.parse(screen.getByTestId('chart-data').textContent || '{}');
    expect(chartData.datasets[0].borderColor).toBe('rgb(75, 192, 192)'); // Bleu pour historique
    expect(chartData.datasets[1].borderColor).toBe('rgb(255, 99, 132)'); // Rouge pour futur
  });

  it('devrait avoir les bons labels pour les datasets', () => {
    render(<MortalityRateChart {...defaultProps} />);
    
    const chartData = JSON.parse(screen.getByTestId('chart-data').textContent || '{}');
    expect(chartData.datasets[0].label).toBe('Taux de mortalité historique - France');
    expect(chartData.datasets[1].label).toBe('Taux de mortalité prédit - France');
  });

  it('devrait avoir le bon titre de l\'axe Y', () => {
    render(<MortalityRateChart {...defaultProps} />);
    
    const chartOptions = JSON.parse(screen.getByTestId('chart-options').textContent || '{}');
    expect(chartOptions.scales.y.title.text).toBe('Taux de mortalité');
  });

  it('devrait avoir le formatage en pourcentage pour l\'axe Y', () => {
    render(<MortalityRateChart {...defaultProps} />);
    
    const chartOptionsText = screen.getByTestId('chart-options').textContent || '{}';
    const chartOptions = JSON.parse(chartOptionsText);
    expect(chartOptions.scales.y).toHaveProperty('ticks');
    expect(chartOptionsText).toContain('[Function]');
  });

  it('devrait gérer les données vides', () => {
    const emptyData = {
      country_id: "1",
      disease_id: "1",
      start_date: "2024-01-01",
      end_date: "2024-01-01",
      mortality_rate: []
    };

    render(<MortalityRateChart mortalityData={emptyData} countryName="France" />);
    
    const chartData = JSON.parse(screen.getByTestId('chart-data').textContent || '{}');
    expect(chartData.labels).toEqual([]);
  });

  it('devrait avoir le bon titre avec un nom de pays différent', () => {
    render(<MortalityRateChart {...defaultProps} countryName="Allemagne" />);
    
    const chartOptions = JSON.parse(screen.getByTestId('chart-options').textContent || '{}');
    expect(chartOptions.plugins.title.text).toBe('Évolution du taux de mortalité - Allemagne');
  });

  it('devrait avoir les bonnes propriétés de style', () => {
    render(<MortalityRateChart {...defaultProps} />);
    
    const chartData = JSON.parse(screen.getByTestId('chart-data').textContent || '{}');
    const dataset = chartData.datasets[0];
    
    expect(dataset.tension).toBe(0.1);
    expect(dataset.fill).toBe(false);
    expect(dataset.pointRadius).toBe(3);
    expect(dataset.pointHoverRadius).toBe(5);
    expect(dataset.spanGaps).toBe(true);
  });

  it('devrait avoir le conteneur avec les bonnes classes CSS', () => {
    render(<MortalityRateChart {...defaultProps} />);
    
    const container = screen.getByTestId('mortality-chart').parentElement;
    expect(container).toHaveClass('w-full', 'h-96', 'mt-8');
  });
}); 