import { useEffect, useState } from "react";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import useLoggedUser, { type User } from "../../hooks/useLoggedUser";
import useCreateUser from "../../hooks/useCreateUser";
import useDeleteUser from "../../hooks/useDeleteUser";

import EditUserForm from "../editUserForm/editUserForm";
import "./allUsers.css";

const initialFormData = {
  firstname: "",
  lastname: "",
  email: "",
  password: "",
  isAdmin: false,
};

const buttonStyle = {
  marginLeft: 5,
  padding: "4px 8px",
  borderRadius: 4,
  border: "none",
  color: "white",
};

const AllUsers = () => {
  const authHeader = useAuthHeader();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"list" | "add" | "edit">("list");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState(initialFormData);

  const {
    user: userLogged,
    loading: userLoading,
    error: userError,
  } = useLoggedUser();
  const {
    createUser,
    loading: creating,
    error: createError,
    createdUser,
  } = useCreateUser();
  const {
    deleteUser,
    loading: deleting,
    error: deleteError,
    deletedUserId,
  } = useDeleteUser();

  // Fetch users on mount and when created or deleted user changes
  useEffect(() => {
    if (!authHeader) {
      setError("Token d'authentification manquant.");
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch("http://qg.enzo-palermo.com:5001/swagger/users", {
      headers: { Authorization: authHeader },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
        setError(null);
        // Retour en mode liste après ajout ou suppression
        setMode("list");
        setEditingUser(null);
        setFormData(initialFormData);
      })
      .catch(() => {
        setError("Erreur lors de la récupération des utilisateurs.");
        setLoading(false);
      });
  }, [authHeader, createdUser, deletedUserId]);

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

  if (loading || userLoading) return <p>Chargement des utilisateurs...</p>;
  if (error || userError)
    return <p style={{ color: "red" }}>Erreur : {error || userError}</p>;

  return (
    <div className="usersSection">
      {mode === "list" && (
        <>
          <h2>Liste des utilisateurs</h2>
          <table className="userTable">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Email</th>
                <th>Rôle</th>
                {userLogged?.isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id_user}>
                  <td data-label="Nom">{user.lastname}</td>
                  <td data-label="Prénom">{user.firstname}</td>
                  <td data-label="Email">{user.email}</td>
                  <td data-label="Rôle">
                    {user.isAdmin ? "Administrateur" : "Utilisateur"}
                  </td>
                  {userLogged?.isAdmin && (
                    <td data-label="Actions">
                      <button
                        style={{ ...buttonStyle, backgroundColor: "red" }}
                        onClick={() => deleteUser(user.id_user)}
                        disabled={deleting}
                      >
                        {deleting ? "..." : "Supprimer"}
                      </button>
                      <button
                        style={{ ...buttonStyle, backgroundColor: "orange" }}
                        onClick={() => {
                          setEditingUser(user);
                          setMode("edit");
                        }}
                      >
                        Modifier
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {deleteError && <p style={{ color: "red" }}>{deleteError}</p>}

          {userLogged?.isAdmin && (
            <div className="addUserButtonContainer">
              <button
                className="CreateNewItemButton"
                onClick={() => {
                  setMode("add");
                  setFormData(initialFormData);
                }}
              >
                Ajouter un utilisateur
              </button>
            </div>
          )}
        </>
      )}

      {mode === "add" && (
        <form className="userForm" onSubmit={handleSubmit}>
          <h3>Créer un nouvel utilisateur</h3>
          <input
            name="firstname"
            type="text"
            placeholder="Prénom"
            value={formData.firstname}
            onChange={handleChange}
            required
          />
          <input
            name="lastname"
            type="text"
            placeholder="Nom"
            value={formData.lastname}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <label>
            Admin :
            <input
              name="isAdmin"
              type="checkbox"
              checked={formData.isAdmin}
              onChange={handleChange}
            />
          </label>
          <button type="submit" disabled={creating}>
            {creating ? "Création..." : "Créer l'utilisateur"}
          </button>
          {createError && <p style={{ color: "red" }}>{createError}</p>}
          {createdUser && (
            <p style={{ color: "green" }}>
              Utilisateur "{createdUser.firstname} {createdUser.lastname}" créé
              avec succès.
            </p>
          )}
          <button type="button" onClick={() => setMode("list")}>
            Annuler
          </button>
        </form>
      )}

      {mode === "edit" && editingUser && (
        <EditUserForm
          user={editingUser}
          onClose={() => {
            setEditingUser(null);
            setMode("list");
          }}
          onUpdate={(updatedUser) => {
            setUsers((prevUsers) =>
              prevUsers.map((u) =>
                u.id_user === updatedUser.id_user ? updatedUser : u
              )
            );
          }}
        />
      )}
    </div>
  );
};

export default AllUsers;
