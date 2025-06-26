import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PredictionChart from './PredictionChart';
import type { Prediction } from '../../../../types/types';

// Mock de react-chartjs-2
vi.mock('react-chartjs-2', () => ({
  Line: ({ data, options }: any) => (
    <div data-testid="prediction-chart">
      <div data-testid="chart-data">{JSON.stringify(data)}</div>
      <div data-testid="chart-options">{JSON.stringify(options)}</div>
    </div>
  )
}));

describe('PredictionChart', () => {
  const mockPredictions: Prediction[] = [
    { id_country: 1, ds: '2024-01-01', yhat: 100 },
    { id_country: 1, ds: '2024-01-02', yhat: 150 },
    { id_country: 1, ds: '2024-01-03', yhat: 200 }
  ];

  const defaultProps = {
    predictions: mockPredictions,
    countryName: 'France'
  };

  it('devrait rendre le graphique', () => {
    render(<PredictionChart {...defaultProps} />);
    
    expect(screen.getByTestId('prediction-chart')).toBeInTheDocument();
  });

  it('devrait afficher le titre correct avec le nom du pays', () => {
    render(<PredictionChart {...defaultProps} />);
    
    const chartOptions = JSON.parse(screen.getByTestId('chart-options').textContent || '{}');
    expect(chartOptions.plugins.title.text).toBe('Évolution des prédictions - France');
  });

  it('devrait afficher le titre avec un nom de pays différent', () => {
    render(<PredictionChart {...defaultProps} countryName="Allemagne" />);
    
    const chartOptions = JSON.parse(screen.getByTestId('chart-options').textContent || '{}');
    expect(chartOptions.plugins.title.text).toBe('Évolution des prédictions - Allemagne');
  });

  it('devrait gérer un tableau de prédictions vide', () => {
    render(<PredictionChart predictions={[]} countryName="France" />);
    
    const chartData = JSON.parse(screen.getByTestId('chart-data').textContent || '{}');
    expect(chartData.labels).toEqual([]);
    expect(chartData.datasets[0].data).toEqual([]);
  });

  it('devrait formater correctement les dates dans les étiquettes', () => {
    render(<PredictionChart {...defaultProps} />);
    
    const chartData = JSON.parse(screen.getByTestId('chart-data').textContent || '{}');
    expect(chartData.labels).toEqual(['01/01/2024', '02/01/2024', '03/01/2024']);
  });

  it('devrait utiliser les valeurs yhat pour les données du graphique', () => {
    render(<PredictionChart {...defaultProps} />);
    
    const chartData = JSON.parse(screen.getByTestId('chart-data').textContent || '{}');
    expect(chartData.datasets[0].data).toEqual([100, 150, 200]);
  });

  it('devrait avoir le bon label pour le dataset', () => {
    render(<PredictionChart {...defaultProps} />);
    
    const chartData = JSON.parse(screen.getByTestId('chart-data').textContent || '{}');
    expect(chartData.datasets[0].label).toBe('Données historiques - France');
  });

  it('devrait avoir le bon style du graphique', () => {
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

  it('devrait avoir le conteneur avec les bonnes classes CSS', () => {
    render(<PredictionChart {...defaultProps} />);
    
    const container = screen.getByTestId('prediction-chart-container');
    expect(container).toHaveClass('w-full', 'h-96', 'mt-8');
  });

  it('devrait avoir les bonnes options de configuration', () => {
    render(<PredictionChart {...defaultProps} />);
    
    const chartOptions = JSON.parse(screen.getByTestId('chart-options').textContent || '{}');
    
    expect(chartOptions.responsive).toBe(true);
    expect(chartOptions.maintainAspectRatio).toBe(false);
    expect(chartOptions.plugins.title.display).toBe(true);
    expect(chartOptions.plugins.legend.display).toBe(true);
    expect(chartOptions.plugins.legend.position).toBe('top');
    expect(chartOptions.scales.y.beginAtZero).toBe(true);
    expect(chartOptions.scales.y.title.text).toBe('Valeurs prédites');
    expect(chartOptions.scales.x.title.text).toBe('Date');
  });

  it('devrait avoir deux datasets (historique et futur)', () => {
    render(<PredictionChart {...defaultProps} />);
    
    const chartData = JSON.parse(screen.getByTestId('chart-data').textContent || '{}');
    expect(chartData.datasets).toHaveLength(2);
    expect(chartData.datasets[0].label).toBe('Données historiques - France');
    expect(chartData.datasets[1].label).toBe('Prédictions futures - France');
  });

  it('devrait avoir les bonnes couleurs pour les datasets', () => {
    render(<PredictionChart {...defaultProps} />);
    
    const chartData = JSON.parse(screen.getByTestId('chart-data').textContent || '{}');
    expect(chartData.datasets[0].borderColor).toBe('rgb(75, 192, 192)'); // Bleu pour historique
    expect(chartData.datasets[1].borderColor).toBe('rgb(255, 99, 132)'); // Rouge pour futur
  });
}); 