import useLoggedUser from '../../hooks/useLoggedUser';

const UserProfile = () => {
  const { user: userLogged, loading, error } = useLoggedUser();

  if (loading) return <p>Chargement des informations utilisateur...</p>;
  if (error) return <p>Erreur: {error}</p>;

  return (
<div className="max-w-2xl mx-auto mt-10 p-6 rounded-2xl shadow-md">
  <h1 className="text-3xl font-bold text-center mb-6">VOTRE PROFIL</h1>
  <div className="space-y-4">
    <p>
      <span className="font-semibold">NOM :</span> {userLogged?.lastname}
    </p>
    <p>
      <span className="font-semibold">PRÉNOM :</span> {userLogged?.firstname}
    </p>
    <p>
      <span className="font-semibold">ADRESSE EMAIL :</span> {userLogged?.email}
    </p>
    <p>
      <span className="font-semibold">RÔLE :</span> {userLogged?.isAdmin === true ? 'Administrateur' : 'Utilisateur'}
    </p>
  </div>
</div>

  );
};

export default UserProfile;
