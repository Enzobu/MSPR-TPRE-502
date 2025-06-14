import { useState } from "react";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

export interface UserForm {
  firstname: string;
  lastname: string;
  email: string;
  isAdmin: boolean;
}

const useUpdateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatedUserId, setUpdatedUserId] = useState<number | null>(null);
  const authHeader = useAuthHeader();

  const updateUser = async (id_user: number, formData: UserForm) => {
    if (!authHeader) {
      setError("Token d'authentification manquant.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://qg.enzo-palermo.com:5001/swagger/users/${id_user}`, {
        method: "PUT",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Échec de la mise à jour de l'utilisateur.");
      }

      setUpdatedUserId(id_user);
    } catch (err: any) {
      setError(err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  return { updateUser, loading, error, updatedUserId };
};

export default useUpdateUser;
