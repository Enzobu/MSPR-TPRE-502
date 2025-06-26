import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCreateUser } from './useCreateUser';

// Mock de react-auth-kit
vi.mock('react-auth-kit/hooks/useAuthHeader', () => ({
  default: () => 'Bearer mock-token'
}));

// Mock de fetch
global.fetch = vi.fn();

describe('useCreateUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait initialiser avec des valeurs par défaut', () => {
    const { result } = renderHook(() => useCreateUser());

    expect(result.current.createdUser).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.createUser).toBe('function');
  });

  it('devrait créer un utilisateur avec succès', async () => {
    const mockUser = {
      id_user: 1,
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      isAdmin: false
    };

    const formData = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      isAdmin: false
    };

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser
    });

    const { result } = renderHook(() => useCreateUser());

    result.current.createUser(formData);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.createdUser).toEqual(mockUser);
    expect(result.current.error).toBeNull();
  });

  it('devrait gérer l\'absence de token d\'authentification', async () => {
    vi.mocked(require('react-auth-kit/hooks/useAuthHeader')).default.mockReturnValue(null);

    const { result } = renderHook(() => useCreateUser());

    const formData = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      isAdmin: false
    };

    result.current.createUser(formData);

    expect(result.current.error).toBe("Token d'authentification manquant.");
  });

  it('devrait gérer les erreurs de création', async () => {
    (fetch as any).mockRejectedValueOnce(new Error('Erreur réseau'));

    const { result } = renderHook(() => useCreateUser());

    const formData = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      isAdmin: false
    };

    result.current.createUser(formData);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Erreur lors de la création de l'utilisateur.");
    expect(result.current.createdUser).toBeNull();
  });

  it('devrait gérer les erreurs HTTP', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 400
    });

    const { result } = renderHook(() => useCreateUser());

    const formData = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      isAdmin: false
    };

    result.current.createUser(formData);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Erreur lors de la création de l'utilisateur.");
    expect(result.current.createdUser).toBeNull();
  });

  it('devrait appeler l\'API avec les bons paramètres', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({})
    });

    const { result } = renderHook(() => useCreateUser());

    const formData = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      isAdmin: false
    };

    result.current.createUser(formData);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://qg.enzo-palermo.com:5001/swagger/users',
        {
          method: 'POST',
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

    const { result } = renderHook(() => useCreateUser());

    const formData = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      isAdmin: false
    };

    result.current.createUser(formData);

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });
}); 