import { describe, it, expect } from 'vitest';
import { continents } from './continents';

describe('continents', () => {
  it('devrait être un tableau non vide', () => {
    expect(Array.isArray(continents)).toBe(true);
    expect(continents.length).toBeGreaterThan(0);
  });

  it('devrait contenir des continents avec les propriétés requises', () => {
    continents.forEach(continent => {
      expect(continent).toHaveProperty('id_continent');
      expect(continent).toHaveProperty('name');
    });
  });

  it('devrait avoir des IDs uniques', () => {
    const ids = continents.map(continent => continent.id_continent);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('devrait avoir des noms uniques', () => {
    const names = continents.map(continent => continent.name);
    const uniqueNames = new Set(names);
    expect(uniqueNames.size).toBe(names.length);
  });

  it('devrait contenir les 7 continents principaux', () => {
    const continentNames = continents.map(continent => continent.name.toLowerCase());
    
    expect(continentNames).toContain('africa');
    expect(continentNames).toContain('antarctica');
    expect(continentNames).toContain('asia');
    expect(continentNames).toContain('europe');
    expect(continentNames).toContain('north america');
    expect(continentNames).toContain('oceania');
    expect(continentNames).toContain('south america');
  });

  it('devrait avoir des noms de continents non vides', () => {
    continents.forEach(continent => {
      expect(continent.name).toBeTruthy();
      expect(continent.name.length).toBeGreaterThan(0);
    });
  });

  it('devrait avoir des IDs numériques positifs', () => {
    continents.forEach(continent => {
      expect(typeof continent.id_continent).toBe('number');
      expect(continent.id_continent).toBeGreaterThan(0);
    });
  });

  it('devrait être trié par ID', () => {
    const sortedIds = [...continents].sort((a, b) => a.id_continent - b.id_continent);
    expect(continents).toEqual(sortedIds);
  });
}); 