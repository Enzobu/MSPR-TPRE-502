import { describe, it, expect } from 'vitest';
import { countries } from './countries';

describe('countries', () => {
  it('devrait être un tableau non vide', () => {
    expect(Array.isArray(countries)).toBe(true);
    expect(countries.length).toBeGreaterThan(0);
  });

  it('devrait contenir des pays avec les propriétés requises', () => {
    countries.forEach(country => {
      expect(country).toHaveProperty('id_country');
      expect(country).toHaveProperty('name');
      expect(country).toHaveProperty('iso_code');
      expect(country).toHaveProperty('population');
      expect(country).toHaveProperty('pib');
      expect(country).toHaveProperty('latitude');
      expect(country).toHaveProperty('longitude');
      expect(country).toHaveProperty('id_continent');
      expect(country).toHaveProperty('id_region');
    });
  });

  it('devrait avoir des IDs uniques', () => {
    const ids = countries.map(country => country.id_country);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('devrait avoir des codes ISO uniques', () => {
    const isoCodes = countries.map(country => country.iso_code);
    const uniqueIsoCodes = new Set(isoCodes);
    expect(uniqueIsoCodes.size).toBe(isoCodes.length);
  });

  it('devrait avoir des populations positives', () => {
    countries.forEach(country => {
      expect(country.population).toBeGreaterThan(0);
    });
  });

  it('devrait avoir des PIB positifs', () => {
    countries.forEach(country => {
      expect(country.pib).toBeGreaterThan(0);
    });
  });

  it('devrait avoir des latitudes valides', () => {
    countries.forEach(country => {
      expect(country.latitude).toBeGreaterThanOrEqual(-90);
      expect(country.latitude).toBeLessThanOrEqual(90);
    });
  });

  it('devrait avoir des longitudes valides', () => {
    countries.forEach(country => {
      expect(country.longitude).toBeGreaterThanOrEqual(-180);
      expect(country.longitude).toBeLessThanOrEqual(180);
    });
  });

  it('devrait contenir des pays européens', () => {
    const europeanCountries = countries.filter(country => 
      country.name.toLowerCase().includes('france') ||
      country.name.toLowerCase().includes('germany') ||
      country.name.toLowerCase().includes('spain') ||
      country.name.toLowerCase().includes('italy')
    );
    expect(europeanCountries.length).toBeGreaterThan(0);
  });

  it('devrait contenir des pays d\'Amérique', () => {
    const americanCountries = countries.filter(country => 
      country.name.toLowerCase().includes('united states') ||
      country.name.toLowerCase().includes('canada') ||
      country.name.toLowerCase().includes('mexico')
    );
    expect(americanCountries.length).toBeGreaterThan(0);
  });

  it('devrait avoir des noms de pays non vides', () => {
    countries.forEach(country => {
      expect(country.name).toBeTruthy();
      expect(country.name.length).toBeGreaterThan(0);
    });
  });

  it('devrait avoir des codes ISO de 2 ou 3 caractères', () => {
    countries.forEach(country => {
      expect(country.iso_code.length).toBeGreaterThanOrEqual(2);
      expect(country.iso_code.length).toBeLessThanOrEqual(3);
    });
  });
}); 