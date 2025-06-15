import { Link, useNavigate } from 'react-router-dom';
import useSignOut from "react-auth-kit/hooks/useSignOut";
import logo from '../../assets/analyze-it-logo.png'; 
import './Navbar.css';

const Navbar = () => {
  const signOut = useSignOut();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src={logo} alt="Analyze It" />
        <Link to="/">Analyze It</Link>
      </div>
      <div className="navbar-links">
        <Link to="/" className="nav-link">Accueil</Link>
        <Link to="/profile" className="nav-link">Compte</Link>
        <button onClick={handleLogout} className="nav-link logout-button">
          Déconnexion
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 