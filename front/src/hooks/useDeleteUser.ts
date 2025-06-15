import { useState } from "react";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

const useDeleteUser = () => {
  const authHeader = useAuthHeader();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletedUserId, setDeletedUserId] = useState<number | null>(null);

  const deleteUser = async (userId: number) => {
    if (!authHeader) {
      setError("Token d'authentification manquant.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`http://qg.enzo-palermo.com:5001/swagger/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: authHeader,
        },
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de l'utilisateur.");
      }
      setDeletedUserId(userId);
      setError(null);
    } catch (err) {
      setError("Erreur lors de la suppression de l'utilisateur.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { deleteUser, loading, error, deletedUserId };
};

export default useDeleteUser;
