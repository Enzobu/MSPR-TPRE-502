import { describe, it, expect } from 'vitest';
import { capitalize } from './capitalize';

describe('capitalize', () => {
  it('devrait capitaliser la première lettre d\'une chaîne simple', () => {
    expect(capitalize('hello')).toBe('Hello');
    expect(capitalize('world')).toBe('World');
  });

  it('devrait gérer les chaînes vides', () => {
    expect(capitalize('')).toBe('');
  });

  it('devrait gérer les chaînes avec une seule lettre', () => {
    expect(capitalize('a')).toBe('A');
    expect(capitalize('z')).toBe('Z');
  });

  it('devrait préserver le reste de la chaîne', () => {
    expect(capitalize('hello world')).toBe('Hello world');
    expect(capitalize('test-string')).toBe('Test-string');
  });

  it('devrait gérer les chaînes déjà capitalisées', () => {
    expect(capitalize('Hello')).toBe('Hello');
    expect(capitalize('WORLD')).toBe('WORLD');
  });

  it('devrait gérer les caractères spéciaux', () => {
    expect(capitalize('123test')).toBe('123test');
    expect(capitalize('!test')).toBe('!test');
    expect(capitalize('émojis')).toBe('Émojis');
  });

  it('devrait gérer les chaînes avec des espaces', () => {
    expect(capitalize(' hello')).toBe(' hello');
    expect(capitalize('  test')).toBe('  test');
  });
}); 