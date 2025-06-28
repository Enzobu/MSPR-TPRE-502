import { describe, it, expect } from 'vitest';
import { chartOptions } from './chartOptions';

describe('chartOptions', () => {
  it('devrait retourner un objet avec les propriétés de base', () => {
    expect(chartOptions).toHaveProperty('responsive');
    expect(chartOptions).toHaveProperty('maintainAspectRatio');
    expect(chartOptions).toHaveProperty('plugins');
    expect(chartOptions).toHaveProperty('scales');
  });

  it('devrait avoir responsive à true', () => {
    expect(chartOptions.responsive).toBe(true);
  });

  it('devrait avoir maintainAspectRatio à false', () => {
    expect(chartOptions.maintainAspectRatio).toBe(false);
  });

  it('devrait avoir les plugins configurés', () => {
    expect(chartOptions.plugins).toHaveProperty('legend');
    expect(chartOptions.plugins).toHaveProperty('tooltip');
    expect(chartOptions.plugins.legend).toHaveProperty('position');
    expect(chartOptions.plugins.tooltip).toHaveProperty('callbacks');
  });

  it('devrait avoir les échelles configurées', () => {
    expect(chartOptions.scales).toHaveProperty('y');
    expect(chartOptions.scales.y).toHaveProperty('beginAtZero');
    expect(chartOptions.scales.y).toHaveProperty('ticks');
  });

  it('devrait avoir beginAtZero à true pour l\'axe Y', () => {
    expect(chartOptions.scales.y.beginAtZero).toBe(true);
  });

  it('devrait avoir les ticks de l\'axe Y configurés', () => {
    expect(chartOptions.scales.y.ticks).toHaveProperty('callback');
  });

  it('devrait avoir la légende en haut', () => {
    expect(chartOptions.plugins.legend.position).toBe('top');
  });

  it('devrait avoir les callbacks du tooltip configurés', () => {
    expect(chartOptions.plugins.tooltip.callbacks).toHaveProperty('label');
  });
}); 