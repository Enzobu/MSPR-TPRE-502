import React from 'react';
import type { Country } from '../../../types/types';
import { countryTranslations } from '../../../data/countryTranslations';
import { capitalize } from '../utils/capitalize';

interface CountrySummaryProps {
  country: Country;
}

const CountrySummary: React.FC<CountrySummaryProps> = ({ country }) => {
  const countryNameFr = capitalize(countryTranslations[country.name.toLowerCase()] || country.name);
  return (
    <div className="country-summary">
      <h2>Résumé du pays sélectionné</h2>
      <ul>
        <li><strong>Pays :</strong> {countryNameFr}</li>
        <li><strong>Population :</strong> {country.population ? Number(country.population).toLocaleString('fr-FR') : 'N/A'}</li>
        <li><strong>PIB :</strong> {country.pib ? Number(country.pib).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }) : 'N/A'}</li>
        {/* Ajoute ici d'autres infos si disponibles dans Country */}
      </ul>
    </div>
  );
};

export default CountrySummary; 