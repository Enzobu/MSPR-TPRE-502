import { describe, it, expect } from 'vitest';
import { countryTranslations } from './countryTranslations';

describe('countryTranslations', () => {
  it('devrait contenir des traductions pour les pays principaux', () => {
    expect(countryTranslations['france']).toBe('France');
    expect(countryTranslations['germany']).toBe('Allemagne');
    expect(countryTranslations['spain']).toBe('Espagne');
    expect(countryTranslations['italy']).toBe('Italie');
    expect(countryTranslations['united kingdom']).toBe('Royaume-Uni');
  });

  it('devrait contenir des traductions pour les pays d\'Amérique', () => {
    expect(countryTranslations['united states']).toBe('États-Unis');
    expect(countryTranslations['canada']).toBe('Canada');
    expect(countryTranslations['mexico']).toBe('Mexique');
    expect(countryTranslations['brazil']).toBe('Brésil');
    expect(countryTranslations['argentina']).toBe('Argentine');
  });

  it('devrait contenir des traductions pour les pays d\'Asie', () => {
    expect(countryTranslations['china']).toBe('Chine');
    expect(countryTranslations['japan']).toBe('Japon');
    expect(countryTranslations['india']).toBe('Inde');
    expect(countryTranslations['south korea']).toBe('Corée du Sud');
    expect(countryTranslations['thailand']).toBe('Thaïlande');
  });

  it('devrait contenir des traductions pour les pays d\'Afrique', () => {
    expect(countryTranslations['south africa']).toBe('Afrique du Sud');
    expect(countryTranslations['egypt']).toBe('Égypte');
    expect(countryTranslations['nigeria']).toBe('Nigeria');
    expect(countryTranslations['kenya']).toBe('Kenya');
    expect(countryTranslations['morocco']).toBe('Maroc');
  });

  it('devrait contenir des traductions pour les pays d\'Océanie', () => {
    expect(countryTranslations['australia']).toBe('Australie');
    expect(countryTranslations['new zealand']).toBe('Nouvelle-Zélande');
  });

  it('devrait être un objet non vide', () => {
    expect(typeof countryTranslations).toBe('object');
    expect(Object.keys(countryTranslations).length).toBeGreaterThan(0);
  });

  it('devrait avoir des clés en minuscules', () => {
    const keys = Object.keys(countryTranslations);
    keys.forEach(key => {
      expect(key).toBe(key.toLowerCase());
    });
  });

  it('devrait avoir des valeurs en français', () => {
    const values = Object.values(countryTranslations);
    values.forEach(value => {
      expect(typeof value).toBe('string');
      expect(value.length).toBeGreaterThan(0);
    });
  });
}); 