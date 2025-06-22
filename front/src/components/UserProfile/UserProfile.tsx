import useLoggedUser from '../../hooks/useLoggedUser';
import './UserProfile.css';

const UserProfile = () => {
  const { user: userLogged, loading, error } = useLoggedUser();

  if (loading) return <p>Chargement des informations utilisateur...</p>;
  if (error) return <p>Erreur: {error}</p>;

  return (
    <div className="MainContainer">
      <h1>VOTRE PROFIL</h1>
      <div className="ProfileContainer">
        <div className="InfoContainer">
          <p>
            <span>NOM : </span>
            {userLogged?.lastname}
          </p>
          <p>
            <span>PRÉNOM : </span>
            {userLogged?.firstname}
          </p>
          <p>
            <span>ADRESSE EMAIL : </span>
            {userLogged?.email}
          </p>
          <p>
            <span>RÔLE : </span>
            {userLogged?.isAdmin === true ? 'Administrateur' : 'Utilisateur'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
