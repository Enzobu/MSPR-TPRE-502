

const Settings = () => {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Paramètres du compte</h2>

      <form className="space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="notifications" className="font-medium">
            Notifications :
          </label>
          <input
            id="notifications"
            type="checkbox"
            defaultChecked
            aria-checked="true"
            aria-label="Activer les notifications"
            className="w-5 h-5"
          />
        </div>

        <div className="flex items-center justify-between">
          <label htmlFor="darkTheme" className="font-medium">
            Thème sombre :
          </label>
          <input
            id="darkTheme"
            type="checkbox"
            aria-checked="false"
            aria-label="Activer le thème sombre"
            className="w-5 h-5"
          />
        </div>

        <button
          type="button"
          aria-label="Enregistrer les modifications"
          className="w-full py-2 px-4 rounded-lg border border-gray-400 hover:bg-gray-100 transition"
        >
          Enregistrer les modifications
        </button>
      </form>
    </div>

  );
};

export default Settings;
