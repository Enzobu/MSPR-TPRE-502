import Navbar from '../../components/Navbar/Navbar';
import Predictions from '../../components/Predictions/Predictions';
import './HomePage.css';

const HomePage = () => {
  return (
    <div>
    <Navbar />
    <div className="home-page">
      <h1>Tableau de bord</h1>
      <Predictions />
    </div>
    </div>
  );
};

export default HomePage; 