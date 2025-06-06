import "./passwordDetails.css"


const MotDePasse = () => {
    return (
        <div className="passwordSection">
            <h2>Changer le mot de passe</h2>
            <form>
                <label>
                    Ancien mot de passe :
                    <input type="password" name="oldPassword" />
                </label>
                <label>
                    Nouveau mot de passe :
                    <input type="password" name="newPassword" />
                </label>
                <label>
                    Confirmer le nouveau mot de passe :
                    <input type="password" name="confirmPassword" />
                </label>
                <button type="submit">Mettre à jour</button>
            </form>
        </div>
    );
};

export default MotDePasse;
