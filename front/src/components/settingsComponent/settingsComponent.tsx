import "./settingsComponent.css"

const Parametres = () => {
    return (
        <div className="settingsSection">
            <h2>Paramètres du compte</h2>
            <p>Notifications : <input type="checkbox" defaultChecked /></p>
            <p>Thème sombre : <input type="checkbox" /></p>
            <button>Enregistrer les modifications</button>
        </div>
    );
};

export default Parametres;
