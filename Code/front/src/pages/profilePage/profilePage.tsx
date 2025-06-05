import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import avatarIcon from "../../assets/default-profile-avatar.png";
import "./profilePage.css";
import Informations from "../../components/profileDetails/profileDetails";
import MotDePasse from "../../components/passwordDetails/passwordDetails";
import Parametres from "../../components/settingsComponent/settingsComponent";
import AllUsers from "../../components/allUsers/allUsers";

const ProfilPage = () => {
  const [activeSection, setActiveSection] = useState("Informations");
  const signOut = useSignOut();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate("/login");
  };

  const renderSection = () => {
    switch (activeSection) {
      case "Informations":
        return <Informations />;
      case "Mot de passe":
        return <MotDePasse />;
      case "Paramètres":
        return <Parametres />;
      case "Utilisateurs":
        return <AllUsers />;
      default:
        return null;
    }
  };

  return (
    <div className="pageContainer">
      <section className="headerSection">
        <div className="profileHeader"></div>
      </section>

      <section className="profileSection">
        <aside className="profileAside">
          <div className="avatarImgContainer">
            <img className="avatarImg" src={avatarIcon} alt="avatar" />
          </div>

          <div>
            <ul>
              {[
                "Informations",
                "Mot de passe",
                "Paramètres",
                "Utilisateurs",
              ].map((item) => (
                <li
                  key={item}
                  className={activeSection === item ? "active" : ""}
                  onClick={() => setActiveSection(item)}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="logoutButtonContainer">
            <button onClick={handleLogout} className="logoutButton">
              Se déconnecter
            </button>
          </div>
        </aside>
        <div className="mainProfile">{renderSection()}</div>
      </section>
    </div>
  );
};

export default ProfilPage;
