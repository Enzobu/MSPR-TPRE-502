import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usePredictions } from './usePredictions';

// Mock de react-auth-kit
vi.mock('react-auth-kit/hooks/useAuthHeader', () => ({
  default: () => 'Bearer mock-token'
}));

// Mock de fetch
global.fetch = vi.fn();

describe('usePredictions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait initialiser avec des valeurs par défaut', () => {
    const { result } = renderHook(() => usePredictions());

    expect(result.current.predictions).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.fetchPredictions).toBe('function');
  });

  it('devrait avoir la fonction fetchPredictions', () => {
    const { result } = renderHook(() => usePredictions());
    expect(typeof result.current.fetchPredictions).toBe('function');
  });

  it('devrait gérer les paramètres manquants', async () => {
    const { result } = renderHook(() => usePredictions());
    
    // Test avec des paramètres manquants
    await result.current.fetchPredictions('', '', null);
    expect(result.current.error).toBe(null);
  });

  it('devrait gérer l\'absence de token d\'authentification', async () => {
    // Créer un nouveau hook avec un mock spécifique
    vi.doMock('react-auth-kit/hooks/useAuthHeader', () => ({
      default: () => null
    }));
    
    const { usePredictions: usePredictionsNoAuth } = await import('./usePredictions');
    const { result } = renderHook(() => usePredictionsNoAuth());
    
    await result.current.fetchPredictions('2024-01-01', '2024-01-02', 1);
    expect(result.current.error).toBe(null);
  });
}); 