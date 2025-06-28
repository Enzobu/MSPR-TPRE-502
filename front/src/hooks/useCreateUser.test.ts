import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useCreateUser from './useCreateUser';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';

// Mock de react-auth-kit
vi.mock('react-auth-kit/hooks/useAuthHeader', () => ({
  default: vi.fn()
}));

const mockUseAuthHeader = vi.mocked(useAuthHeader);

// Mock de fetch
global.fetch = vi.fn();

describe('useCreateUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuthHeader.mockReturnValue('Bearer mock-token');
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

    await act(async () => {
      await result.current.createUser(formData);
    });

    expect(result.current.createdUser).toEqual(mockUser);
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('devrait gérer l\'absence de token d\'authentification', async () => {
    mockUseAuthHeader.mockReturnValue(null);

    const { result } = renderHook(() => useCreateUser());

    const formData = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      isAdmin: false
    };

    await act(async () => {
      await result.current.createUser(formData);
    });

    expect(result.current.error).toBe("Token d'authentification manquant.");
    expect(result.current.createdUser).toBeNull();
    expect(result.current.loading).toBe(false);
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

    await act(async () => {
      await result.current.createUser(formData);
    });

    expect(result.current.error).toBe("Erreur lors de la création de l'utilisateur.");
    expect(result.current.createdUser).toBeNull();
    expect(result.current.loading).toBe(false);
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

    await act(async () => {
      await result.current.createUser(formData);
    });

    expect(result.current.error).toBe("Erreur lors de la création de l'utilisateur.");
    expect(result.current.createdUser).toBeNull();
    expect(result.current.loading).toBe(false);
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

    await act(async () => {
      await result.current.createUser(formData);
    });

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

  it('devrait gérer l\'état de chargement', async () => {
    (fetch as any).mockImplementation(() => 
      new Promise((resolve) => 
        setTimeout(() => resolve({
          ok: true,
          json: async () => ({})
        }), 100)
      )
    );

    const { result } = renderHook(() => useCreateUser());

    const formData = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      isAdmin: false
    };

    let createPromise: Promise<void>;
    
    act(() => {
      createPromise = result.current.createUser(formData);
    });

    // Vérifier que l'état de loading est mis à jour
    await waitFor(() => {
      expect(result.current.loading).toBe(true);
    });

    await act(async () => {
      await createPromise;
    });

    expect(result.current.loading).toBe(false);
  });
}); 