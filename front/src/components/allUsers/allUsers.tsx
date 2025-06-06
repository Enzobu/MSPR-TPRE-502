import { useEffect, useState } from "react";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import useLoggedUser, { type User } from "../../hooks/useLoggedUser";
import useCreateUser from "../../hooks/useCreateUser";
import "./allUsers.css";

const AllUsers = () => {
  const authHeader = useAuthHeader();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    isAdmin: false,
  });

  const { user: userLogged, loading: userLoading, error: userError } = useLoggedUser();
  const { createUser, loading: creating, error: createError, createdUser } = useCreateUser();

  useEffect(() => {
    if (!authHeader) {
      setError("Token d'authentification manquant.");
      setLoading(false);
      return;
    }

    fetch("http://qg.enzo-palermo.com:5001/swagger/users", {
      headers: { Authorization: authHeader },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Erreur lors de la récupération des utilisateurs.");
        setLoading(false);
        console.error(err);
      });
  }, [authHeader, createdUser]); // Rafraîchir la liste quand un user est ajouté

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
    setFormData({
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      isAdmin: false,
    });
  };

  if (loading || userLoading) return <p>Chargement des utilisateurs...</p>;
  if (error || userError)
    return <p style={{ color: "red" }}>Erreur : {error || userError}</p>;

  return (
    <div className="usersSection">
      {!showForm && (
        <>
          <h2>Liste des utilisateurs</h2>
          <table className="userTable">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Email</th>
                <th>Rôle</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td data-label="Nom">{user.lastname}</td>
                  <td data-label="Prénom">{user.firstname}</td>
                  <td data-label="Email">{user.email}</td>
                  <td data-label="Rôle">{user.isAdmin ? "Administrateur" : "Utilisateur"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {userLogged?.isAdmin && (
        <>
          <div className="addUserButtonContainer">
            <button className="CreateNewItemButton" onClick={() => setShowForm((prev) => !prev)}>
              {showForm ? "Fermer le formulaire" : "Ajouter un utilisateur"}
            </button>
          </div>

          {showForm && (
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
                  Utilisateur "{createdUser.firstname} {createdUser.lastname}" créé avec succès.
                </p>
              )}
            </form>
          )}
        </>
      )}
    </div>
  );
};

export default AllUsers;
