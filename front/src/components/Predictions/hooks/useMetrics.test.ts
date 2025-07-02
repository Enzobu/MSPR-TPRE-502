import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useMetrics } from './useMetrics';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';

vi.mock('react-auth-kit/hooks/useAuthHeader', () => ({
  default: vi.fn()
}));

const mockUseAuthHeader = vi.mocked(useAuthHeader);

global.fetch = vi.fn();

describe('useMetrics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuthHeader.mockReturnValue('Bearer mock-token');
  });

  it('devrait initialiser avec des valeurs par défaut', () => {
    const { result } = renderHook(() => useMetrics());
    expect(result.current.metrics).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.fetchMetrics).toBe('function');
  });

  it('devrait récupérer les métriques avec succès', async () => {
    const mockMetrics = {
      id_metrics: 45,
      _date: '2025-06-30',
      rmse: 25684.35,
      mae: 1574.25,
      r2: 0.92,
      rmse_bis: 1684.35,
      mae_bis: 874.25,
      r2_bis: 0.98,
      continent: 'Europe',
      continent_r2: 78.95,
      continent_r2_bis: 96.95
    };
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockMetrics
    });
    const { result } = renderHook(() => useMetrics());
    await act(async () => {
      await result.current.fetchMetrics(1);
    });
    expect(result.current.metrics).toEqual(mockMetrics);
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('devrait gérer les erreurs de récupération', async () => {
    (fetch as any).mockRejectedValueOnce(new Error('Erreur réseau'));
    const { result } = renderHook(() => useMetrics());
    await act(async () => {
      await result.current.fetchMetrics(1);
    });
    expect(result.current.error).toBe('Erreur réseau');
    expect(result.current.metrics).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('devrait gérer les erreurs HTTP', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404
    });
    const { result } = renderHook(() => useMetrics());
    await act(async () => {
      await result.current.fetchMetrics(1);
    });
    expect(result.current.error).toBe('Erreur HTTP: 404');
    expect(result.current.metrics).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('devrait appeler l\'API avec le bon paramètre', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({})
    });
    const { result } = renderHook(() => useMetrics());
    await act(async () => {
      await result.current.fetchMetrics(42);
    });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/swagger/metrics/get?id_country=42'),
      expect.objectContaining({
        method: 'GET',
        headers: {
          Authorization: 'Bearer mock-token',
          'Content-Type': 'application/json',
        },
      })
    );
  });

  it('devrait gérer l\'absence de token d\'authentification', async () => {
    mockUseAuthHeader.mockReturnValue(null);
    const { result } = renderHook(() => useMetrics());
    await act(async () => {
      await result.current.fetchMetrics(1);
    });
    expect(result.current.error).toBe("Token d'authentification manquant");
    expect(result.current.metrics).toBeNull();
    expect(result.current.loading).toBe(false);
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
    const { result } = renderHook(() => useMetrics());
    let fetchPromise: Promise<void>;
    act(() => {
      fetchPromise = result.current.fetchMetrics(1);
    });
    await waitFor(() => {
      expect(result.current.loading).toBe(true);
    });
    await act(async () => {
      await fetchPromise;
    });
    expect(result.current.loading).toBe(false);
  });
}); 