import { useState } from "react";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

const useDeleteUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletedUserId, setDeletedUserId] = useState<number | null>(null);
  const authHeader = useAuthHeader();

  const deleteUser = async (userId: number) => {
    if (!authHeader) {
      setError("Token d'authentification manquant.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://qg.enzo-palermo.com:5001/swagger/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: authHeader,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de l'utilisateur.");
      }

      setDeletedUserId(userId);
    } catch (err: any) {
      setError(err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  return { deleteUser, loading, error, deletedUserId };
};

export default useDeleteUser;
