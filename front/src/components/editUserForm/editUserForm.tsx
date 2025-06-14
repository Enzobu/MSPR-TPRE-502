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
  onUpdate: (updated: {
    id_user: number;
    firstname: string;
    lastname: string;
    email: string;
    isAdmin: boolean;
  }) => void;
}


const EditUserForm = ({ user, onClose, onUpdate }: EditUserFormProps) => {
  const [formData, setFormData] = useState<UserForm>({
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    isAdmin: user.isAdmin,
  });

  const { updateUser, loading, error, updatedUserId } = useUpdateUser();

useEffect(() => {
  if (updatedUserId === user.id_user) {
    onUpdate({
      id_user: user.id_user,
      firstname: formData.firstname,
      lastname: formData.lastname,
      email: formData.email,
      isAdmin: formData.isAdmin,
    });
    onClose();
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
