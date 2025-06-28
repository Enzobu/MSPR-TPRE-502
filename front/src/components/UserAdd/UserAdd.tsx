import { useState } from "react";
import useCreateUser from "../../hooks/useCreateUser";

interface UserAddProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const UserAdd = ({ onSuccess, onCancel }: UserAddProps) => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    isAdmin: false,
  });

  const { createUser, loading, error, createdUser } = useCreateUser();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createUser(formData);
    if (createdUser && onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="addUserForm">
      <label htmlFor="firstname">Prénom</label>
      <input id="firstname" name="firstname" type="text" placeholder="Prénom" onChange={handleChange} required aria-required="true" />
      <label htmlFor="lastname">Nom</label>
      <input id="lastname" name="lastname" type="text" placeholder="Nom" onChange={handleChange} required aria-required="true" />
      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" placeholder="Email" onChange={handleChange} required aria-required="true" />
      <label htmlFor="password">Mot de passe</label>
      <input id="password" name="password" type="password" placeholder="Mot de passe" onChange={handleChange} required aria-required="true" />
      <label htmlFor="isAdmin">Admin :
        <input id="isAdmin" name="isAdmin" type="checkbox" onChange={handleChange} />
      </label>
      <button type="submit" disabled={loading} aria-label="Créer l'utilisateur">
        {loading ? "Création..." : "Créer l'utilisateur"}
      </button>
      <button type="button" className="cancelButton" onClick={onCancel} aria-label="Annuler la création">Annuler</button>
      {error && <p style={{ color: "red" }} aria-live="polite">{error}</p>}
      {createdUser && <p aria-live="polite">Utilisateur {createdUser.firstname} créé avec succès.</p>}
    </form>
  );
};

export default UserAdd;
