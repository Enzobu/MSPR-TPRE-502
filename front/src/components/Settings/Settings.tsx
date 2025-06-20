import "./Settings.css"

const Settings = () => {
    return (
        <div className="settingsSection">
            <h2>Paramètres du compte</h2>
            <label>
              Notifications :
              <input type="checkbox" defaultChecked aria-checked="true" aria-label="Activer les notifications" />
            </label>
            <label>
              Thème sombre :
              <input type="checkbox" aria-checked="false" aria-label="Activer le thème sombre" />
            </label>
            <button type="button" aria-label="Enregistrer les modifications">Enregistrer les modifications</button>
        </div>
    );
};

export default Settings;
