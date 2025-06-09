import { useState, useEffect } from "react";
import useUpdateUser, { type UserForm } from "../../hooks/useUpdateUser";

interface EditUserFormProps {
  user: {
    id_user: number;
    firstname: string;
    lastname: string;
    email: string;
    isAdmin: boolean;
  };
  onClose: () => void;
}

const EditUserForm = ({ user, onClose }: EditUserFormProps) => {
  const [formData, setFormData] = useState<UserForm>({
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    password: "", // on peut le laisser vide si non changé
    isAdmin: user.isAdmin,
  });

  const { updateUser, loading, error, updatedUserId } = useUpdateUser();

  useEffect(() => {
    if (updatedUserId === user.id_user) {
      onClose(); // fermer le formulaire après succès
    }
  }, [updatedUserId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUser(user.id_user, formData);
  };

  return (
    <form className="userForm" onSubmit={handleSubmit}>
      <h3>Modifier l'utilisateur</h3>
      <input name="firstname" type="text" value={formData.firstname} onChange={handleChange} />
      <input name="lastname" type="text" value={formData.lastname} onChange={handleChange} />
      <input name="email" type="email" value={formData.email} onChange={handleChange} />
      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
      />
      <label>
        Admin :
        <input name="isAdmin" type="checkbox" checked={formData.isAdmin} onChange={handleChange} />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? "Mise à jour..." : "Mettre à jour"}
      </button>
      <button type="button" onClick={onClose}>Annuler</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default EditUserForm;
