import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">COVID Predictions</Link>
      </div>
      <div className="navbar-links">
        <Link to="/" className="nav-link">Accueil</Link>
        <Link to="/profile" className="nav-link">Profil</Link>
        <button onClick={handleLogout} className="nav-link logout-button">
          Déconnexion
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 