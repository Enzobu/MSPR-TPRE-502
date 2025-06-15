import { useState } from "react";
import useCreateUser from "../../hooks/useCreateUser";
import "./UserAdd.css";

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
      <input name="firstname" type="text" placeholder="Prénom" onChange={handleChange} required />
      <input name="lastname" type="text" placeholder="Nom" onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Mot de passe" onChange={handleChange} required />
      <label>
        Admin :
        <input name="isAdmin" type="checkbox" onChange={handleChange} />
      </label>
        <button type="submit" disabled={loading}>
          {loading ? "Création..." : "Créer l'utilisateur"}
        </button>
        <button type="button" className="cancelButton" onClick={onCancel}>
          Annuler
        </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {createdUser && <p>Utilisateur {createdUser.firstname} créé avec succès.</p>}
    </form>
  );
};

export default UserAdd;
