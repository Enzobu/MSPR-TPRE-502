import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useUpdateUser } from './useUpdateUser';

// Mock de react-auth-kit
vi.mock('react-auth-kit/hooks/useAuthHeader', () => ({
  default: () => 'Bearer mock-token'
}));

// Mock de fetch
global.fetch = vi.fn();

describe('useUpdateUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

    result.current.updateUser(1, formData);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.updatedUserId).toBe(1);
    expect(result.current.error).toBeNull();
  });

  it('devrait gérer l\'absence de token d\'authentification', async () => {
    vi.mocked(require('react-auth-kit/hooks/useAuthHeader')).default.mockReturnValue(null);

    const { result } = renderHook(() => useUpdateUser());

    const formData = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      isAdmin: false
    };

    result.current.updateUser(1, formData);

    expect(result.current.error).toBe("Token d'authentification manquant.");
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

    result.current.updateUser(1, formData);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Erreur lors de la mise à jour de l'utilisateur.");
    expect(result.current.updatedUserId).toBeNull();
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

    result.current.updateUser(1, formData);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Erreur lors de la mise à jour de l'utilisateur.");
    expect(result.current.updatedUserId).toBeNull();
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

    result.current.updateUser(1, formData);

    await waitFor(() => {
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
  });

  it('devrait gérer l\'état de chargement', async () => {
    (fetch as any).mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    const { result } = renderHook(() => useUpdateUser());

    const formData = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      isAdmin: false
    };

    result.current.updateUser(1, formData);

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });
}); 