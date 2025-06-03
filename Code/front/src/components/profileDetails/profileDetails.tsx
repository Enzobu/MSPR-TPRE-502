import "./profileDetails.css"

const Informations = () => {
    const user = {
        nom: "Dupont",
        prenom: "Jean",
        email: "jean.dupont@example.com",
    };

    return (
        <div className="infoSection">
            <h2>Informations personnelles</h2>
            <p><strong>Nom :</strong> {user.nom}</p>
            <p><strong>Prénom :</strong> {user.prenom}</p>
            <p><strong>Email :</strong> {user.email}</p>
        </div>
    );
};

export default Informations;
