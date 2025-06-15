import { useState } from "react";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import type { EditUserForm } from "../types/types";

const useUpdateUser = () => {
  const authHeader = useAuthHeader();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatedUserId, setUpdatedUserId] = useState<number | null>(null);

  const updateUser = async (userId: number, formData: EditUserForm) => {
    if (!authHeader) {
      setError("Token d'authentification manquant.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`http://qg.enzo-palermo.com:5001/swagger/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour de l'utilisateur.");
      }
      setUpdatedUserId(userId);
      setError(null);
    } catch (err) {
      setError("Erreur lors de la mise à jour de l'utilisateur.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { updateUser, loading, error, updatedUserId };
};

export default useUpdateUser;
