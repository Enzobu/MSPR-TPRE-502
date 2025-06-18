import React from 'react';
import type { Country } from '../../../types/types';
import { countryTranslations } from '../../../data/countryTranslations';
import { capitalize } from '../utils/capitalize';
import { format, addDays } from 'date-fns';

interface PredictionsControlsProps {
  startDate: string;
  endDate: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  selectedCountry: number | null;
  setSelectedCountry: (id: number) => void;
  countries: Country[];
  onFetch: () => void;
  disabled: boolean;
}

const PredictionsControls: React.FC<PredictionsControlsProps> = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  selectedCountry,
  setSelectedCountry,
  countries,
  onFetch,
  disabled
}) => (
  <div className="predictions-controls">
    <div className="date-controls">
      <label>
        Date de début:
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          min={format(addDays(new Date(), 1), 'yyyy-MM-dd')}
        />
      </label>
      <label>
        Date de fin:
        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          min={startDate || format(addDays(new Date(), 1), 'yyyy-MM-dd')}
          max={startDate ? format(addDays(new Date(startDate), 89), 'yyyy-MM-dd') : ''}
        />
      </label>
    </div>
    <div className="country-select">
      <label>
        Pays:
        <select
          value={selectedCountry || ''}
          onChange={e => setSelectedCountry(Number(e.target.value))}
        >
          <option value="">Sélectionnez un pays</option>
          {countries.map(country => (
            <option key={country.id_country} value={country.id_country}>
              {capitalize(countryTranslations[country.name.toLowerCase()] || country.name)}
            </option>
          ))}
        </select>
      </label>
    </div>
    <button
      onClick={onFetch}
      disabled={disabled}
      className="fetch-button"
    >
      Afficher les prédictions
    </button>
  </div>
);

export default PredictionsControls; 