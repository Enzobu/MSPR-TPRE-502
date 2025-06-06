
import { useEffect, useState } from "react";
import { decodeToken } from "react-jwt";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

export interface User {
  id: number;
  lastname: string;
  firstname: string;
  email: string;
  isAdmin: boolean;
}

interface DecodedToken {
  sub: string;
  fresh: boolean;
  iat: number;
  jti: string;
  type: string;
  nbf: number;
  exp: number;
  csrf: string;
}

const useLoggedUser = () => {
  const authHeader = useAuthHeader();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authHeader) {
      setError("Token d'authentification manquant.");
      setLoading(false);
      return;
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = decodeToken<DecodedToken>(token);

    if (!decoded?.sub) {
      setError("Token invalide.");
      setLoading(false);
      return;
    }

    fetch(`http://qg.enzo-palermo.com:5001/swagger/users/${decoded.sub}`, {
      headers: { Authorization: authHeader },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Erreur lors de la récupération de l'utilisateur.");
        setLoading(false);
        console.error(err);
      });
  }, [authHeader]);

  return { user, loading, error };
};

export default useLoggedUser;
