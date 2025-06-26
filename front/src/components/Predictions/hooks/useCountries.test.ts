import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCountries } from './useCountries';

// Mock de react-auth-kit
vi.mock('react-auth-kit/hooks/useAuthHeader', () => ({
  default: () => 'Bearer mock-token'
}));

// Mock de fetch
global.fetch = vi.fn();

// Mock des traductions
vi.mock('../../../data/countryTranslations', () => ({
  countryTranslations: {
    'france': 'France',
    'germany': 'Allemagne'
  }
}));

describe('useCountries', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait initialiser avec des valeurs par défaut', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    const { result } = renderHook(() => useCountries());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.countries).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('devrait récupérer les pays avec succès', async () => {
    const mockCountries = [
      { id_country: 1, name: 'France', iso_code: 'FRA', population: 67000000, pib: 3000000000000, latitude: 46.2276, longitude: 2.2137, id_continent: 1, id_region: 1 },
      { id_country: 2, name: 'Germany', iso_code: 'DEU', population: 83000000, pib: 4000000000000, latitude: 51.1657, longitude: 10.4515, id_continent: 1, id_region: 1 }
    ];

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCountries
    });

    const { result } = renderHook(() => useCountries());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.countries).toEqual(mockCountries);
    expect(result.current.error).toBeNull();
  });

  it('devrait gérer les erreurs de récupération', async () => {
    (fetch as any).mockRejectedValueOnce(new Error('Erreur réseau'));

    const { result } = renderHook(() => useCountries());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Erreur réseau');
    expect(result.current.countries).toEqual([]);
  });

  it('devrait gérer les erreurs HTTP', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500
    });

    const { result } = renderHook(() => useCountries());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Failed to fetch countries');
    expect(result.current.countries).toEqual([]);
  });

  it('devrait appeler l\'API avec les bons paramètres', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    renderHook(() => useCountries());

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://qg.enzo-palermo.com:5001/swagger/countries',
        {
          headers: {
            'Authorization': 'Bearer mock-token',
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );
    });
  });
}); 