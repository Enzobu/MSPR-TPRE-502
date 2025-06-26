import { describe, it, expect } from 'vitest';
import { getCountryFlag } from './flagUtils';

describe('flagUtils', () => {
  describe('getCountryFlag', () => {
    it('devrait retourner le drapeau pour un code ISO valide', () => {
      expect(getCountryFlag('FR')).toBe('🇫🇷');
      expect(getCountryFlag('US')).toBe('🇺🇸');
      expect(getCountryFlag('DE')).toBe('🇩🇪');
      expect(getCountryFlag('ES')).toBe('🇪🇸');
    });

    it('devrait retourner le drapeau pour un code ISO en minuscules', () => {
      expect(getCountryFlag('fr')).toBe('🇫🇷');
      expect(getCountryFlag('us')).toBe('🇺🇸');
    });

    it('devrait retourner le drapeau pour un code ISO à 3 lettres', () => {
      expect(getCountryFlag('FRA')).toBe('🇫🇷');
      expect(getCountryFlag('USA')).toBe('🇺🇸');
      expect(getCountryFlag('DEU')).toBe('🇩🇪');
    });

    it('devrait retourner un drapeau par défaut pour un code invalide', () => {
      expect(getCountryFlag('XX')).toBe('🏳️');
      expect(getCountryFlag('INVALID')).toBe('🏳️');
    });

    it('devrait gérer les chaînes vides', () => {
      expect(getCountryFlag('')).toBe('🏳️');
    });

    it('devrait gérer les valeurs null et undefined', () => {
      expect(getCountryFlag(null as any)).toBe('🏳️');
      expect(getCountryFlag(undefined as any)).toBe('🏳️');
    });

    it('devrait gérer les codes avec des espaces', () => {
      expect(getCountryFlag(' FR ')).toBe('🇫🇷');
      expect(getCountryFlag('  US  ')).toBe('🇺🇸');
    });
  });
}); 