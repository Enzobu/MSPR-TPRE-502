import { describe, it, expect } from 'vitest';

// Import des types pour les tester
import type { 
  User, 
  Country, 
  Continent, 
  Region, 
  Prediction, 
  Disease, 
  ClimatType, 
  Statement, 
  PlaceStatement, 
  WeatherReport 
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
        population: 67000000,
        pib: 3000000000000,
        latitude: 46.2276,
        longitude: 2.2137,
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

  describe('Continent type', () => {
    it('devrait avoir la structure correcte', () => {
      const continent: Continent = {
        id_continent: 1,
        name: 'Europe'
      };

      expect(continent).toHaveProperty('id_continent');
      expect(continent).toHaveProperty('name');
    });
  });

  describe('Region type', () => {
    it('devrait avoir la structure correcte', () => {
      const region: Region = {
        id_region: 1,
        name: 'Western Europe',
        id_continent: 1
      };

      expect(region).toHaveProperty('id_region');
      expect(region).toHaveProperty('name');
      expect(region).toHaveProperty('id_continent');
    });
  });

  describe('Prediction type', () => {
    it('devrait avoir la structure correcte', () => {
      const prediction: Prediction = {
        id_country: 1,
        ds: '2024-01-01',
        yhat: 100
      };

      expect(prediction).toHaveProperty('id_country');
      expect(prediction).toHaveProperty('ds');
      expect(prediction).toHaveProperty('yhat');
    });
  });

  describe('Disease type', () => {
    it('devrait avoir la structure correcte', () => {
      const disease: Disease = {
        id_disease: 1,
        name: 'COVID-19',
        description: 'Coronavirus disease 2019'
      };

      expect(disease).toHaveProperty('id_disease');
      expect(disease).toHaveProperty('name');
      expect(disease).toHaveProperty('description');
    });
  });

  describe('ClimatType type', () => {
    it('devrait avoir la structure correcte', () => {
      const climatType: ClimatType = {
        id_climat_type: 1,
        name: 'Tropical',
        description: 'Tropical climate'
      };

      expect(climatType).toHaveProperty('id_climat_type');
      expect(climatType).toHaveProperty('name');
      expect(climatType).toHaveProperty('description');
    });
  });

  describe('Statement type', () => {
    it('devrait avoir la structure correcte', () => {
      const statement: Statement = {
        id_statement: 1,
        content: 'Test statement',
        id_user: 1,
        created_at: '2024-01-01T00:00:00Z'
      };

      expect(statement).toHaveProperty('id_statement');
      expect(statement).toHaveProperty('content');
      expect(statement).toHaveProperty('id_user');
      expect(statement).toHaveProperty('created_at');
    });
  });

  describe('PlaceStatement type', () => {
    it('devrait avoir la structure correcte', () => {
      const placeStatement: PlaceStatement = {
        id_place_statement: 1,
        id_statement: 1,
        id_country: 1,
        latitude: 46.2276,
        longitude: 2.2137
      };

      expect(placeStatement).toHaveProperty('id_place_statement');
      expect(placeStatement).toHaveProperty('id_statement');
      expect(placeStatement).toHaveProperty('id_country');
      expect(placeStatement).toHaveProperty('latitude');
      expect(placeStatement).toHaveProperty('longitude');
    });
  });

  describe('WeatherReport type', () => {
    it('devrait avoir la structure correcte', () => {
      const weatherReport: WeatherReport = {
        id_weather_report: 1,
        id_country: 1,
        date: '2024-01-01',
        temperature: 20.5,
        humidity: 65,
        precipitation: 0,
        wind_speed: 10
      };

      expect(weatherReport).toHaveProperty('id_weather_report');
      expect(weatherReport).toHaveProperty('id_country');
      expect(weatherReport).toHaveProperty('date');
      expect(weatherReport).toHaveProperty('temperature');
      expect(weatherReport).toHaveProperty('humidity');
      expect(weatherReport).toHaveProperty('precipitation');
      expect(weatherReport).toHaveProperty('wind_speed');
    });
  });
}); 