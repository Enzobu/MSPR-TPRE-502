import { useEffect, useState } from "react";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import useLoggedUser from "../../hooks/useLoggedUser";
import useDeleteUser from "../../hooks/useDeleteUser";
import type { User } from "../../types/types";

import "./UserList.css";
import EditUserComponent from "../UserEdit/UserEdit";
import UserAdd from "../UserAdd/UserAdd";

const buttonStyle = {
  marginLeft: 5,
  padding: "4px 8px",
  borderRadius: 4,
  border: "none",
  color: "white",
};

const UserList = () => {
  const authHeader = useAuthHeader();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"list" | "add" | "edit">("list");
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const {
    user: userLogged,
    loading: userLoading,
    error: userError,
  } = useLoggedUser();
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
      })
      .catch(() => {
        setError("Erreur lors de la récupération des utilisateurs.");
        setLoading(false);
      });
  }, [authHeader, deletedUserId]);

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
                onClick={() => setMode("add")}
              >
                Ajouter un utilisateur
              </button>
            </div>
          )}
        </>
      )}

      {mode === "add" && (
        <div>
          <h3>Créer un nouvel utilisateur</h3>
          <UserAdd 
            onSuccess={() => setMode("list")} 
            onCancel={() => setMode("list")} 
          />
        </div>
      )}

      {mode === "edit" && editingUser && (
        <EditUserComponent
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

export default UserList;