import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useMortalityRate } from './useMortalityRate';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';

// Mock de react-auth-kit avec une fonction mocké
vi.mock('react-auth-kit/hooks/useAuthHeader', () => ({
  default: vi.fn()
}));

const mockUseAuthHeader = vi.mocked(useAuthHeader);

// Mock de fetch
global.fetch = vi.fn();

describe('useMortalityRate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Réinitialiser le mock à la valeur par défaut
    mockUseAuthHeader.mockReturnValue('Bearer mock-token');
  });

  it('devrait initialiser avec des valeurs par défaut', () => {
    const { result } = renderHook(() => useMortalityRate());

    expect(result.current.mortalityData).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.fetchMortalityRate).toBe('function');
  });

  it('devrait récupérer les taux de mortalité avec succès', async () => {
    const mockMortalityData = {
      country_id: "1",
      disease_id: "1",
      start_date: "2024-01-01",
      end_date: "2024-01-02",
      mortality_rate: [
        { "2024-01-01": 0.018808039797055132 },
        { "2024-01-02": 0.018808039797055132 }
      ]
    };

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockMortalityData
    });

    const { result } = renderHook(() => useMortalityRate());

    await act(async () => {
      await result.current.fetchMortalityRate('2024-01-01', '2024-01-02', 1);
    });

    expect(result.current.mortalityData).toEqual(mockMortalityData);
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('devrait gérer les erreurs de récupération', async () => {
    (fetch as any).mockRejectedValueOnce(new Error('Erreur réseau'));

    const { result } = renderHook(() => useMortalityRate());

    await act(async () => {
      await result.current.fetchMortalityRate('2024-01-01', '2024-01-02', 1);
    });

    expect(result.current.error).toBe('Erreur réseau');
    expect(result.current.mortalityData).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('devrait gérer les erreurs HTTP', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404
    });

    const { result } = renderHook(() => useMortalityRate());

    await act(async () => {
      await result.current.fetchMortalityRate('2024-01-01', '2024-01-02', 1);
    });

    expect(result.current.error).toBe('Erreur HTTP: 404');
    expect(result.current.mortalityData).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('devrait appeler l\'API avec les bons paramètres', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({})
    });

    const { result } = renderHook(() => useMortalityRate());

    await act(async () => {
      await result.current.fetchMortalityRate('2024-01-01', '2024-01-02', 1, 2);
    });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/swagger/predictions/mortality-rate?disease_id=2&start_date=2024-01-01&end_date=2024-01-02&country_id=1'),
      expect.objectContaining({
        method: 'GET',
        headers: {
          'Authorization': 'Bearer mock-token',
          'Content-Type': 'application/json',
        },
      })
    );
  });

  it('devrait utiliser le disease_id par défaut (1)', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({})
    });

    const { result } = renderHook(() => useMortalityRate());

    await act(async () => {
      await result.current.fetchMortalityRate('2024-01-01', '2024-01-02', 1);
    });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('disease_id=1'),
      expect.any(Object)
    );
  });

  it('devrait gérer l\'état de chargement', async () => {
    (fetch as any).mockImplementation(() => 
      new Promise((resolve) => 
        setTimeout(() => resolve({
          ok: true,
          json: async () => ({})
        }), 100)
      )
    );

    const { result } = renderHook(() => useMortalityRate());

    let fetchPromise: Promise<void>;
    
    act(() => {
      fetchPromise = result.current.fetchMortalityRate('2024-01-01', '2024-01-02', 1);
    });

    // Attendre un peu pour que l'état de loading soit mis à jour
    await waitFor(() => {
      expect(result.current.loading).toBe(true);
    });

    await act(async () => {
      await fetchPromise;
    });

    expect(result.current.loading).toBe(false);
  });

  it('devrait gérer l\'absence de token d\'authentification', async () => {
    // Mock le hook pour retourner null
    mockUseAuthHeader.mockReturnValue(null);

    const { result } = renderHook(() => useMortalityRate());

    await act(async () => {
      await result.current.fetchMortalityRate('2024-01-01', '2024-01-02', 1);
    });

    expect(result.current.error).toBe('Token d\'authentification manquant');
    expect(result.current.mortalityData).toBeNull();
    expect(result.current.loading).toBe(false);
  });
}); 