// src/hooks/useCreateUser.ts
import { useState } from "react";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import type { User, UserForm } from "../types/types";

const useCreateUser = () => {
  const authHeader = useAuthHeader();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdUser, setCreatedUser] = useState<User | null>(null);

  const createUser = async (formData: UserForm) => {
    if (!authHeader) {
      setError("Token d'authentification manquant.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://qg.enzo-palermo.com:5001/swagger/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la création de l'utilisateur.");
      }
      const data = await response.json();
      setCreatedUser(data);
      setError(null);
    } catch (err) {
      setError("Erreur lors de la création de l'utilisateur.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { createUser, loading, error, createdUser };
};

export default useCreateUser;
