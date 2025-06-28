import { describe, it, expect } from 'vitest';

// Import des types pour les tester
import type { 
  User, 
  Country, 
  Prediction, 
} from './types';

describe('TypeScript Types', () => {
  describe('User type', () => {
    it('devrait avoir la structure correcte', () => {
      const user: User = {
        id_user: 1,
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
        isAdmin: false
      };

      expect(user).toHaveProperty('id_user');
      expect(user).toHaveProperty('firstname');
      expect(user).toHaveProperty('lastname');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('isAdmin');
    });
  });

  describe('Country type', () => {
    it('devrait avoir la structure correcte', () => {
      const country: Country = {
        id_country: 1,
        name: 'France',
        iso_code: 'FRA',
        population: '67000000',
        pib: '3000000000000',
        latitude: '46.2276',
        longitude: '2.2137',
        id_continent: 1,
        id_region: 1
      };

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

  describe('Prediction type', () => {
    it('devrait avoir la structure correcte', () => {
      const prediction: Prediction = {
        id_country: 1,
        ds: '2024-01-01',
        yhat: 100,
        yhat_lower: 90,
        yhat_upper: 110,
        trend: 0.5,
        trend_lower: 0.4,
        trend_upper: 0.6,
        deaths: 10,
        deaths_lower: 8,
        deaths_upper: 12,
        pib: 1000000,
        pib_lower: 900000,
        pib_upper: 1100000,
        population: 1000000,
        population_lower: 950000,
        population_upper: 1050000,
        id_prediction: 1,
        id_disease: 1,
      };

      expect(prediction).toHaveProperty('id_country');
      expect(prediction).toHaveProperty('ds');
      expect(prediction).toHaveProperty('yhat');
      expect(prediction).toHaveProperty('yhat_lower');
      expect(prediction).toHaveProperty('yhat_upper');
      expect(prediction).toHaveProperty('trend');
      expect(prediction).toHaveProperty('trend_lower');
      expect(prediction).toHaveProperty('trend_upper');
      expect(prediction).toHaveProperty('deaths');
      expect(prediction).toHaveProperty('deaths_lower');
      expect(prediction).toHaveProperty('deaths_upper');
      expect(prediction).toHaveProperty('pib');
      expect(prediction).toHaveProperty('pib_lower');
      expect(prediction).toHaveProperty('pib_upper');
      expect(prediction).toHaveProperty('population');
    });
  });
}); 