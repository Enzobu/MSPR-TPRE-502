// src/hooks/useCreateUser.ts
import { useState } from "react";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import type { User } from "./useLoggedUser";

interface NewUserData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

const useCreateUser = () => {
  const authHeader = useAuthHeader();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdUser, setCreatedUser] = useState<User | null>(null);

  const createUser = async (userData: NewUserData) => {
    setLoading(true);
    setError(null);
    setCreatedUser(null);

    try {
      const response = await fetch("http://qg.enzo-palermo.com:5001/swagger/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: authHeader || "",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errMessage = await response.text();
        throw new Error(errMessage || "Erreur lors de la création de l'utilisateur.");
      }

      const data = await response.json();
      setCreatedUser(data);
    } catch (err: any) {
      setError(err.message || "Erreur inconnue.");
    } finally {
      setLoading(false);
    }
  };

  return { createUser, loading, error, createdUser };
};

export default useCreateUser;
