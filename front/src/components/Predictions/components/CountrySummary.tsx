import React from 'react';
import type { Country } from '../../../types/types';
import { countryTranslations } from '../../../data/countryTranslations';
import { capitalize } from '../utils/capitalize';
import { getFlagEmojiFromIso3 } from '../../../utils/flagUtils';
import './CountrySummary.css';

interface CountrySummaryProps {
  country: Country;
}

const CountrySummary: React.FC<CountrySummaryProps> = ({ country }) => {
  const countryNameFr = capitalize(countryTranslations[country.name.toLowerCase()] || country.name);
  
  return (
    <div className="country-summary">
      <div className="country-header">
        <div className="country-flag">
          <span className="flag-emoji">
            {getFlagEmojiFromIso3(country.iso_code)}
          </span>
        </div>
        <div className="country-info">
          <h2 className="country-name">{countryNameFr}</h2>
          <p className="country-code">{country.iso_code || 'N/A'}</p>
        </div>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card population">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-value">
              {country.population ? Number(country.population).toLocaleString('fr-FR') : 'N/A'}
            </div>
            <div className="stat-label">Population</div>
          </div>
        </div>
        
        <div className="stat-card economy">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-value">
              {country.pib ? Number(country.pib).toLocaleString('fr-FR', { 
                style: 'currency', 
                currency: 'EUR', 
                maximumFractionDigits: 0,
                notation: 'compact'
              }) : 'N/A'}
            </div>
            <div className="stat-label">PIB</div>
          </div>
        </div>
        
        <div className="stat-card location">
          <div className="stat-icon">📍</div>
          <div className="stat-content">
            <div className="stat-value">
              {country.latitude && country.longitude 
                ? `${Number(country.latitude).toFixed(2)}°, ${Number(country.longitude).toFixed(2)}°`
                : 'N/A'
              }
            </div>
            <div className="stat-label">Coordonnées</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountrySummary; 