import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useDeleteUser from './useDeleteUser';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';

// Mock de react-auth-kit
vi.mock('react-auth-kit/hooks/useAuthHeader', () => ({
  default: vi.fn()
}));

const mockUseAuthHeader = vi.mocked(useAuthHeader);

// Mock de fetch
global.fetch = vi.fn();

describe('useDeleteUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuthHeader.mockReturnValue('Bearer mock-token');
  });

  it('devrait initialiser avec des valeurs par défaut', () => {
    const { result } = renderHook(() => useDeleteUser());

    expect(result.current.deletedUserId).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.deleteUser).toBe('function');
  });

  it('devrait supprimer un utilisateur avec succès', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true
    });

    const { result } = renderHook(() => useDeleteUser());

    await act(async () => {
      await result.current.deleteUser(1);
    });

    expect(result.current.deletedUserId).toBe(1);
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('devrait gérer l\'absence de token d\'authentification', async () => {
    mockUseAuthHeader.mockReturnValue(null);

    const { result } = renderHook(() => useDeleteUser());

    await act(async () => {
      await result.current.deleteUser(1);
    });

    expect(result.current.error).toBe("Token d'authentification manquant.");
    expect(result.current.deletedUserId).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('devrait gérer les erreurs de suppression', async () => {
    (fetch as any).mockRejectedValueOnce(new Error('Erreur réseau'));

    const { result } = renderHook(() => useDeleteUser());

    await act(async () => {
      await result.current.deleteUser(1);
    });

    expect(result.current.error).toBe("Erreur lors de la suppression de l'utilisateur.");
    expect(result.current.deletedUserId).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('devrait gérer les erreurs HTTP', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404
    });

    const { result } = renderHook(() => useDeleteUser());

    await act(async () => {
      await result.current.deleteUser(1);
    });

    expect(result.current.error).toBe("Erreur lors de la suppression de l'utilisateur.");
    expect(result.current.deletedUserId).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('devrait appeler l\'API avec les bons paramètres', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true
    });

    const { result } = renderHook(() => useDeleteUser());

    await act(async () => {
      await result.current.deleteUser(1);
    });

    expect(fetch).toHaveBeenCalledWith(
      'http://qg.enzo-palermo.com:5001/swagger/users/1',
      {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer mock-token',
        },
      }
    );
  });

  it('devrait gérer l\'état de chargement', async () => {
    (fetch as any).mockImplementation(() => 
      new Promise((resolve) => 
        setTimeout(() => resolve({
          ok: true
        }), 100)
      )
    );

    const { result } = renderHook(() => useDeleteUser());

    let deletePromise: Promise<void>;
    
    act(() => {
      deletePromise = result.current.deleteUser(1);
    });

    // Vérifier que l'état de loading est mis à jour
    await waitFor(() => {
      expect(result.current.loading).toBe(true);
    });

    await act(async () => {
      await deletePromise;
    });

    expect(result.current.loading).toBe(false);
  });
}); 