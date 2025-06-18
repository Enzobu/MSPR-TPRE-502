import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import avatarIcon from "../../assets/default-profile-avatar.png";
import "./profilePage.css";
import Informations from "../../components/UserProfile/UserProfile";
import MotDePasse from "../../components/PasswordChange/PasswordChange";
import Parametres from "../../components/Settings/Settings";
import AllUsers from "../../components/UserList/UserList";
import useLoggedUser from "../../hooks/useLoggedUser";
import Layout from "../../components/Layout/Layout";

const ProfilePage = () => {
  const [activeSection, setActiveSection] = useState("Informations");
  const signOut = useSignOut();
  const navigate = useNavigate();
  const { user, loading, error } = useLoggedUser(); // <-- on utilise le hook

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
        return user?.isAdmin ? <AllUsers /> : <p>Accès refusé</p>;
      default:
        return null;
    }
  };

  const menuItems = [
    "Informations",
    "Mot de passe",
    "Paramètres",
    ...(user?.isAdmin ? ["Utilisateurs"] : []),
  ];

  if (loading) return <p>Chargement...</p>;
  if (error) return <p style={{ color: "red" }}>Erreur : {error}</p>;

  return (
    <Layout>
      <div className="profile-container">
        <h1>Votre Compte</h1>
        <div className="pageContainer">

          <section className="profileSection">
            <aside className="profileAside">
              <div className="avatarImgContainer">
                <img className="avatarImg" src={avatarIcon} alt="avatar" />
              </div>

              <div>
                <ul role="menu">
                  {menuItems.map((item) => (
                    <li
                      key={item}
                      className={activeSection === item ? "active" : ""}
                      role="menuitem"
                      tabIndex={0}
                      aria-current={activeSection === item ? "page" : undefined}
                      onClick={() => setActiveSection(item)}
                      onKeyDown={e => {
                        if (e.key === "Enter" || e.key === " ") {
                          setActiveSection(item);
                        }
                      }}
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
      </div>
    </Layout>
  );
};

export default ProfilePage;
