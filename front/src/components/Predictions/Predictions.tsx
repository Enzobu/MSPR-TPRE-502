import { useState } from 'react';
import './Predictions.css';
import { useCountries } from './hooks/useCountries';
import { usePredictions } from './hooks/usePredictions';
import CountrySummary from './components/CountrySummary';
import PredictionsControls from './components/PredictionsControls';

const Predictions: React.FC = () => {
  const { countries } = useCountries();
  const { predictions, loading: predictionsLoading, error: predictionsError, fetchPredictions } = usePredictions();
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);

  const filteredPredictions = selectedCountry ? predictions.filter(p => p.id_country === selectedCountry) : [];

  const selectedCountryData = selectedCountry ? countries.find(c => c.id_country === selectedCountry) : null;

  return (
    <div className="predictions-container">
      <PredictionsControls
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        countries={countries}
        onFetch={() => fetchPredictions(startDate, endDate, selectedCountry)}
        disabled={!startDate || !endDate || !selectedCountry}
      />
      {predictionsError && <div className="error-message">{predictionsError}</div>}
      {predictionsLoading && <div className="loading-message">Chargement des prédictions...</div>}
      
      {filteredPredictions.length > 0 && selectedCountryData && (
        <div className="charts-container">
          <CountrySummary 
            country={selectedCountryData}
          />
        </div>
      )}
    </div>
  );
};

export default Predictions; 