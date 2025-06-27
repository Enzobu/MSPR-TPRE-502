import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn', () => {
  it('devrait combiner des classes CSS', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('devrait gérer les classes conditionnelles', () => {
    expect(cn('base', true && 'conditional')).toBe('base conditional');
    expect(cn('base', false && 'conditional')).toBe('base');
  });

  it('devrait gérer les objets conditionnels', () => {
    expect(cn('base', { conditional: true })).toBe('base conditional');
    expect(cn('base', { conditional: false })).toBe('base');
  });

  it('devrait gérer les tableaux', () => {
    expect(cn('base', ['class1', 'class2'])).toBe('base class1 class2');
  });

  it('devrait gérer les valeurs undefined et null', () => {
    expect(cn('base', undefined, null, 'valid')).toBe('base valid');
  });

  it('devrait gérer les chaînes vides', () => {
    expect(cn('base', '', 'valid')).toBe('base valid');
  });

  it('devrait gérer des cas complexes', () => {
    expect(cn(
      'base',
      'static',
      true && 'conditional',
      false && 'ignored',
      { active: true, disabled: false },
      ['array1', 'array2']
    )).toBe('base static conditional active array1 array2');
  });

  it('devrait conserver les doublons de classes génériques', () => {
    // cn utilise twMerge qui ne supprime pas les doublons de classes non-Tailwind
    expect(cn('class1', 'class1', 'class2')).toBe('class1 class1 class2');
  });

  it('devrait gérer les espaces multiples', () => {
    expect(cn('  class1  ', '  class2  ')).toBe('class1 class2');
  });
}); 