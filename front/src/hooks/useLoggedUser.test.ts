import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useLoggedUser from './useLoggedUser';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import { decodeToken } from 'react-jwt';

// Mock de react-auth-kit
vi.mock('react-auth-kit/hooks/useAuthHeader', () => ({
  default: vi.fn()
}));

// Mock de react-jwt
vi.mock('react-jwt', () => ({
  decodeToken: vi.fn()
}));

const mockUseAuthHeader = vi.mocked(useAuthHeader);
const mockDecodeToken = vi.mocked(decodeToken);

// Mock de fetch
global.fetch = vi.fn();

describe('useLoggedUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuthHeader.mockReturnValue('Bearer mock-token');
  });

  it('devrait initialiser avec des valeurs par défaut', async () => {
    // Mocker decodeToken pour retourner null afin d'éviter l'exécution du useEffect
    mockDecodeToken.mockReturnValue(null);
    
    const { result } = renderHook(() => useLoggedUser());

    // Vérifier l'état initial
    expect(result.current.user).toBeNull();
    
    // Attendre que useEffect se termine
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Vérifier que l'erreur est définie à cause du token invalide
    expect(result.current.error).toBe("Token invalide.");
  });

  it('devrait récupérer l\'utilisateur avec succès', async () => {
    const mockUser = {
      id_user: 1,
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      isAdmin: false
    };

    const mockDecodedToken = {
      sub: '1',
      fresh: false,
      iat: 1234567890,
      jti: 'token-id',
      type: 'access',
      nbf: 1234567890,
      exp: 1234567890,
      csrf: 'csrf-token'
    };

    mockDecodeToken.mockReturnValue(mockDecodedToken);

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser
    });

    const { result } = renderHook(() => useLoggedUser());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.error).toBeNull();
  });

  it('devrait gérer l\'absence de token d\'authentification', async () => {
    mockUseAuthHeader.mockReturnValue(null);

    const { result } = renderHook(() => useLoggedUser());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Token d'authentification manquant.");
    expect(result.current.user).toBeNull();
  });

  it('devrait gérer un token invalide', async () => {
    mockDecodeToken.mockReturnValue(null);

    const { result } = renderHook(() => useLoggedUser());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Token invalide.");
    expect(result.current.user).toBeNull();
  });

  it('devrait gérer les erreurs de récupération', async () => {
    const mockDecodedToken = {
      sub: '1',
      fresh: false,
      iat: 1234567890,
      jti: 'token-id',
      type: 'access',
      nbf: 1234567890,
      exp: 1234567890,
      csrf: 'csrf-token'
    };

    mockDecodeToken.mockReturnValue(mockDecodedToken);

    (fetch as any).mockRejectedValueOnce(new Error('Erreur réseau'));

    const { result } = renderHook(() => useLoggedUser());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Erreur lors de la récupération de l'utilisateur.");
    expect(result.current.user).toBeNull();
  });

  it('devrait appeler l\'API avec les bons paramètres', async () => {
    const mockDecodedToken = {
      sub: '1',
      fresh: false,
      iat: 1234567890,
      jti: 'token-id',
      type: 'access',
      nbf: 1234567890,
      exp: 1234567890,
      csrf: 'csrf-token'
    };

    mockDecodeToken.mockReturnValue(mockDecodedToken);

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({})
    });

    renderHook(() => useLoggedUser());

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://qg.enzo-palermo.com:5001/swagger/users/1',
        {
          headers: { Authorization: 'Bearer mock-token' },
        }
      );
    });
  });

  it('devrait gérer l\'état de chargement', async () => {
    const mockDecodedToken = {
      sub: '1',
      fresh: false,
      iat: 1234567890,
      jti: 'token-id',
      type: 'access',
      nbf: 1234567890,
      exp: 1234567890,
      csrf: 'csrf-token'
    };

    mockDecodeToken.mockReturnValue(mockDecodedToken);

    (fetch as any).mockImplementation(() => 
      new Promise((resolve) => 
        setTimeout(() => resolve({
          ok: true,
          json: async () => ({})
        }), 100)
      )
    );

    const { result } = renderHook(() => useLoggedUser());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });
}); 