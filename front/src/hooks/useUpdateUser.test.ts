import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useUpdateUser from './useUpdateUser';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';

// Mock de react-auth-kit
vi.mock('react-auth-kit/hooks/useAuthHeader', () => ({
  default: vi.fn()
}));

const mockUseAuthHeader = vi.mocked(useAuthHeader);

// Mock de fetch
global.fetch = vi.fn();

describe('useUpdateUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuthHeader.mockReturnValue('Bearer mock-token');
  });

  it('devrait initialiser avec des valeurs par défaut', () => {
    const { result } = renderHook(() => useUpdateUser());

    expect(result.current.updatedUserId).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.updateUser).toBe('function');
  });

  it('devrait mettre à jour un utilisateur avec succès', async () => {
    const formData = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      isAdmin: false
    };

    (fetch as any).mockResolvedValueOnce({
      ok: true
    });

    const { result } = renderHook(() => useUpdateUser());

    await act(async () => {
      await result.current.updateUser(1, formData);
    });

    expect(result.current.updatedUserId).toBe(1);
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('devrait gérer l\'absence de token d\'authentification', async () => {
    mockUseAuthHeader.mockReturnValue(null);

    const { result } = renderHook(() => useUpdateUser());

    const formData = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      isAdmin: false
    };

    await act(async () => {
      await result.current.updateUser(1, formData);
    });

    expect(result.current.error).toBe("Token d'authentification manquant.");
    expect(result.current.updatedUserId).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('devrait gérer les erreurs de mise à jour', async () => {
    (fetch as any).mockRejectedValueOnce(new Error('Erreur réseau'));

    const { result } = renderHook(() => useUpdateUser());

    const formData = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      isAdmin: false
    };

    await act(async () => {
      await result.current.updateUser(1, formData);
    });

    expect(result.current.error).toBe("Erreur lors de la mise à jour de l'utilisateur.");
    expect(result.current.updatedUserId).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('devrait gérer les erreurs HTTP', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 400
    });

    const { result } = renderHook(() => useUpdateUser());

    const formData = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      isAdmin: false
    };

    await act(async () => {
      await result.current.updateUser(1, formData);
    });

    expect(result.current.error).toBe("Erreur lors de la mise à jour de l'utilisateur.");
    expect(result.current.updatedUserId).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('devrait appeler l\'API avec les bons paramètres', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true
    });

    const { result } = renderHook(() => useUpdateUser());

    const formData = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      isAdmin: false
    };

    await act(async () => {
      await result.current.updateUser(1, formData);
    });

    expect(fetch).toHaveBeenCalledWith(
      'http://qg.enzo-palermo.com:5001/swagger/users/1',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-token',
        },
        body: JSON.stringify(formData),
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

    const { result } = renderHook(() => useUpdateUser());

    const formData = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      isAdmin: false
    };

    let updatePromise: Promise<void>;
    
    act(() => {
      updatePromise = result.current.updateUser(1, formData);
    });

    // Vérifier que l'état de loading est mis à jour
    await waitFor(() => {
      expect(result.current.loading).toBe(true);
    });

    await act(async () => {
      await updatePromise;
    });

    expect(result.current.loading).toBe(false);
  });
}); 