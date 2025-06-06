import { useEffect, useState } from "react";
import { decodeToken } from "react-jwt";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { Link } from "react-router-dom";
import "./allUsers.css";

interface User {
  id: number;
  lastname: string;
  firstname: string;
  email: string;
  role: string;
}

interface DecodedToken {
  sub: string;
  fresh: boolean;
  iat: number;
  jti: string;
  type: string;
  nbf: number;
  exp: number;
  csrf: string;
}

const AllUsers = () => {
  const authHeader = useAuthHeader();
  const [users, setUsers] = useState<User[]>([]);
  const [userLogged, setUserLogged] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authHeader) {
      setError("Token d'authentification manquant.");
      setLoading(false);
      return;
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = decodeToken<DecodedToken>(token);

    if (!decoded || !decoded.sub) {
      setError("Token invalide.");
      setLoading(false);
      return;
    }

    const fetchLoggedUser = fetch(`http://qg.enzo-palermo.com:5001/swagger/users/${decoded.sub}`, {
      headers: { Authorization: authHeader },
    }).then(res => res.json());

    const fetchAllUsers = fetch("http://qg.enzo-palermo.com:5001/swagger/users", {
      headers: { Authorization: authHeader },
    }).then(res => res.json());

    Promise.all([fetchLoggedUser, fetchAllUsers])
      .then(([loggedUser, usersList]) => {
        setUserLogged(loggedUser);
        setUsers(usersList);
        setLoading(false);
      })
      .catch((err) => {
        setError("Erreur lors de la récupération des données.");
        setLoading(false);
        console.error(err);
      });
  }, [authHeader]);

  if (loading) return <p>Chargement des utilisateurs...</p>;
  if (error) return <p style={{ color: "red" }}>Erreur : {error}</p>;

  return (
    <div className="usersSection">
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
              <td data-label="Rôle">{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* {userLogged?.role === "Administrateur" && (*/}
        <div className="addUserButtonContainer">
          <Link to="/backoffice/utilisateurs/ajouter">
            <button className="CreateNewItemButton">
              Ajouter un utilisateur
            </button>
          </Link>
        </div>
      {/*)}*/}
    </div>
  );
};

export default AllUsers;
