import { useEffect, useState } from "react";
import "./UserProfile.css";
import { decodeToken } from "react-jwt";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

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

interface User {
  lastname: string;
  firstname: string;
  email: string;
  isAdmin: boolean;
}

export function UserProfile() {
  const authHeader = useAuthHeader();
  const [userLogged, setUserLogged] = useState<User | null>(null);

  useEffect(() => {
    if (!authHeader) return;

    const token = authHeader?.replace("Bearer ", "");
    if (!token) return;

    const decoded = decodeToken<DecodedToken>(token);
    if (!decoded || !decoded.sub) return;

    const userId = decoded.sub;

    fetch(`http://qg.enzo-palermo.com:5001/swagger/users/${userId}`, {
      headers: {
        Authorization: authHeader,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            "Erreur lors de la récupération des données utilisateur"
          );
        }
        
        return res.json();
      })
      .then((data) => {
        console.log(data);
        
        setUserLogged(data);
      })
      .catch((err) => {
        console.error("Erreur :", err);
      });
  }, []);

  if (!userLogged) return <p>Chargement des informations utilisateur...</p>;

  return (
    <div className="MainContainer">
      <h1>VOTRE PROFIL</h1>
      <div className="ProfileContainer">
        <div className="InfoContainer">
          <p>
            <span>NOM : </span>
            {userLogged.lastname}
          </p>
          <p>
            <span>PRÉNOM : </span>
            {userLogged.firstname}
          </p>
          <p>
            <span>ADRESSE EMAIL : </span>
            {userLogged.email}
          </p>
          <p>
            <span>RÔLE : </span>
            {userLogged.isAdmin === true ? "Administrateur" : "Utilisateur"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
