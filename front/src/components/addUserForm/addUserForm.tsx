import { useState } from "react";
import useCreateUser from "../../hooks/useCreateUser";

const AddUserForm = () => {
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
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="firstname" placeholder="Prénom" onChange={handleChange} />
      <input name="lastname" placeholder="Nom" onChange={handleChange} />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} />
      <input name="password" type="password" placeholder="Mot de passe" onChange={handleChange} />
      <label>
        Admin :
        <input name="isAdmin" type="checkbox" onChange={handleChange} />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? "Création..." : "Créer l'utilisateur"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {createdUser && <p>Utilisateur {createdUser.firstname} créé avec succès.</p>}
    </form>
  );
};

export default AddUserForm;
