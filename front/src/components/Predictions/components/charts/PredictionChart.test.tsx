import { render, screen } from '@testing-library/react';
import PredictionChart from './PredictionChart';
import type { Prediction } from '../../../../types/types';

describe('PredictionChart', () => {
  beforeAll(() => {
    // Mock de Chart.js
    require('react-chartjs-2').Line = ({ data, options }: any) => (
      <div data-testid="line-chart">
        <div data-testid="chart-title">{options.plugins.title.text}</div>
        <div data-testid="chart-data">{JSON.stringify(data)}</div>
      </div>
    );
  });

  const mockPredictions: Prediction[] = [
    {
      id_prediction: 1,
      id_country: 1,
      id_disease: 1,
      ds: '2024-01-01',
      yhat: 100,
      yhat_lower: 80,
      yhat_upper: 120,
      trend: 5,
      trend_lower: 3,
      trend_upper: 7,
      deaths: 10,
      deaths_lower: 8,
      deaths_upper: 12,
      pib: 1000,
      pib_lower: 900,
      pib_upper: 1100,
      population: 10000,
      population_lower: 9500,
      population_upper: 10500,
    },
    {
      id_prediction: 2,
      id_country: 1,
      id_disease: 1,
      ds: '2024-01-02',
      yhat: 150,
      yhat_lower: 130,
      yhat_upper: 170,
      trend: 8,
      trend_lower: 6,
      trend_upper: 10,
      deaths: 15,
      deaths_lower: 12,
      deaths_upper: 18,
      pib: 1000,
      pib_lower: 900,
      pib_upper: 1100,
      population: 10000,
      population_lower: 9500,
      population_upper: 10500,
    },
    {
      id_prediction: 3,
      id_country: 1,
      id_disease: 1,
      ds: '2024-01-03',
      yhat: 200,
      yhat_lower: 180,
      yhat_upper: 220,
      trend: 12,
      trend_lower: 10,
      trend_upper: 14,
      deaths: 20,
      deaths_lower: 18,
      deaths_upper: 25,
      pib: 1000,
      pib_lower: 900,
      pib_upper: 1100,
      population: 10000,
      population_lower: 9500,
      population_upper: 10500,
    },
  ];

  const defaultProps = {
    predictions: mockPredictions,
    countryName: 'France',
  };

  it('should render the chart', () => {
    render(<PredictionChart {...defaultProps} />);
    
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('should display the correct title with country name', () => {
    render(<PredictionChart {...defaultProps} />);
    
    expect(screen.getByTestId('chart-title')).toHaveTextContent('Évolution des prédictions - France');
  });

  it('should render with different country name', () => {
    render(<PredictionChart {...defaultProps} countryName="Allemagne" />);
    
    expect(screen.getByTestId('chart-title')).toHaveTextContent('Évolution des prédictions - Allemagne');
  });

  it('should handle empty predictions array', () => {
    render(<PredictionChart predictions={[]} countryName="France" />);
    
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    const chartData = JSON.parse(screen.getByTestId('chart-data').textContent || '{}');
    expect(chartData.labels).toEqual([]);
    expect(chartData.datasets[0].data).toEqual([]);
  });

  it('should format dates correctly in chart labels', () => {
    render(<PredictionChart {...defaultProps} />);
    
    const chartData = JSON.parse(screen.getByTestId('chart-data').textContent || '{}');
    expect(chartData.labels).toEqual(['01/01/2024', '02/01/2024', '03/01/2024']);
  });

  it('should use yhat values for chart data', () => {
    render(<PredictionChart {...defaultProps} />);
    
    const chartData = JSON.parse(screen.getByTestId('chart-data').textContent || '{}');
    expect(chartData.datasets[0].data).toEqual([100, 150, 200]);
  });

  it('should have correct dataset label', () => {
    render(<PredictionChart {...defaultProps} />);
    
    const chartData = JSON.parse(screen.getByTestId('chart-data').textContent || '{}');
    expect(chartData.datasets[0].label).toBe('Prédictions pour France');
  });

  it('should have correct chart styling', () => {
    render(<PredictionChart {...defaultProps} />);
    
    const chartData = JSON.parse(screen.getByTestId('chart-data').textContent || '{}');
    const dataset = chartData.datasets[0];
    
    expect(dataset.borderColor).toBe('rgb(75, 192, 192)');
    expect(dataset.backgroundColor).toBe('rgba(75, 192, 192, 0.2)');
    expect(dataset.tension).toBe(0.1);
    expect(dataset.fill).toBe(false);
    expect(dataset.pointRadius).toBe(3);
    expect(dataset.pointHoverRadius).toBe(5);
  });

  it('should render chart container with correct styling', () => {
    render(<PredictionChart {...defaultProps} />);
    
    const container = screen.getByTestId('line-chart').parentElement;
    expect(container).toHaveClass('chart-container');
    expect(container).toHaveStyle({ 
      height: '400px', 
      marginTop: '2rem' 
    });
  });
}); 