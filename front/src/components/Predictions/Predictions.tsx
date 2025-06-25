import { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { countryTranslations } from '../../data/countryTranslations';
import './Predictions.css';
import { useCountries } from './hooks/useCountries';
import { usePredictions } from './hooks/usePredictions';
import { capitalize } from './utils/capitalize';
import CountrySummary from './components/CountrySummary';
import PredictionsControls from './components/PredictionsControls';
import PredictionChart from './components/charts/PredictionChart';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Predictions: React.FC = () => {
  const { countries } = useCountries();
  const { predictions, loading: predictionsLoading, error: predictionsError, fetchPredictions } = usePredictions();
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);

  const filteredPredictions = selectedCountry ? predictions.filter(p => p.id_country === selectedCountry) : [];
  const selectedCountryData = selectedCountry ? countries.find(c => c.id_country === selectedCountry) : null;
  const selectedCountryNameFr = selectedCountryData ? capitalize(countryTranslations[selectedCountryData.name.toLowerCase()] || selectedCountryData.name) : '';

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
      {predictionsLoading && <div className="loading">Chargement...</div>}
      
      {!predictionsLoading && !predictionsError && predictions.length > 0 && (
        <>
          {selectedCountryData && <CountrySummary country={selectedCountryData} />}
          
          <PredictionChart 
            predictions={filteredPredictions} 
            countryName={selectedCountryNameFr} 
          />
        </>
      )}
    </div>
  );
};

export default Predictions;
