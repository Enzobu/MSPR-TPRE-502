import { useState } from "react";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import useLoggedUser from "../../hooks/useLoggedUser";

const PasswordChange = () => {
  const authHeader = useAuthHeader();
  const { user } = useLoggedUser();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const { newPassword, confirmPassword } = formData;

    if (!newPassword || newPassword.length < 8) {
      setError("Le nouveau mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    // facultatif : vérifier oldPassword côté client si tu l'as en mémoire
    setLoading(true);
    try {
      const res = await fetch(
        `http://qg.enzo-palermo.com:5001/swagger/users/${user?.id_user}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: authHeader || "",
          },
          body: JSON.stringify({
            password: newPassword,
            oldPassword: formData.oldPassword,
          }),
        }
      );

      if (!res.ok) throw new Error("Échec de la mise à jour du mot de passe.");

      setSuccess("Mot de passe mis à jour avec succès.");
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError("Erreur lors de la mise à jour. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="passwordSection">
      <h2>Changer le mot de passe</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="oldPassword">
          Ancien mot de passe :
          <input
            id="oldPassword"
            type="password"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            required
            aria-required="true"
          />
        </label>
        <label htmlFor="newPassword">
          Nouveau mot de passe :
          <input
            id="newPassword"
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
            aria-required="true"
          />
        </label>
        <label htmlFor="confirmPassword">
          Confirmer le nouveau mot de passe :
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            aria-required="true"
          />
        </label>
        <button type="submit" disabled={loading} aria-label="Mettre à jour le mot de passe">
          {loading ? "Mise à jour..." : "Mettre à jour"}
        </button>
        {error && <p style={{ color: "red" }} aria-live="polite">{error}</p>}
        {success && <p style={{ color: "green" }} aria-live="polite">{success}</p>}
      </form>
    </div>
  );
};

export default PasswordChange;
