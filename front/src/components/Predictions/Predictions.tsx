
import { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { format} from 'date-fns';
import type { Prediction} from '../../types/types';
import { countryTranslations } from '../../data/countryTranslations';
import { continents, getCountriesByContinent, type Continent } from '../../data/continents';
import './Predictions.css';
import { useCountries } from './hooks/useCountries';
import { usePredictions } from './hooks/usePredictions';
import { capitalize } from './utils/capitalize';
import { chartOptions } from './utils/chartOptions';
import CountrySummary from './components/CountrySummary';
import PredictionsControls from './components/PredictionsControls';
import ContinentBarChart from './components/charts/ContinentBarChart';
import ContinentPredictionBarChart from './components/charts/ContinentPredictionBarChart';
import ContinentMortalityLineChart from './components/charts/ContinentMortalityLineChart';
import ContinentMortalityPredictionLineChart from './components/charts/ContinentMortalityPredictionLineChart';
import CountryMortalityLineChart from './components/charts/CountryMortalityLineChart';
import CountryMortalityPredictionLineChart from './components/charts/CountryMortalityPredictionLineChart';
import CountryRecoveryLineChart from './components/charts/CountryRecoveryLineChart';
import CountryRecoveryPredictionLineChart from './components/charts/CountryRecoveryPredictionLineChart';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Predictions: React.FC = () => {
  const { countries} = useCountries();
  const { predictions, loading: predictionsLoading, error: predictionsError, fetchPredictions } = usePredictions();
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);

  const filteredPredictions = selectedCountry ? predictions.filter(p => p.id_country === selectedCountry) : [];

  const selectedCountryData = selectedCountry ? countries.find(c => c.id_country === selectedCountry) : null;

  // Nom du pays en français et capitalisé
  const selectedCountryNameFr = selectedCountryData ? capitalize(countryTranslations[selectedCountryData.name.toLowerCase()] || selectedCountryData.name) : '';

  // Récupérer les deux points temporels : début et fin
  const predictionStart = filteredPredictions[0];
  const predictionEnd = filteredPredictions[filteredPredictions.length - 1];
  const startLabel = predictionStart ? format(new Date(predictionStart.ds), 'dd/MM/yyyy') : '';
  const endLabel = endDate ? format(new Date(endDate), 'dd/MM/yyyy') : '';
  const twoPointLabels = [startLabel, endLabel];

  // Graphique de taux de mortalité (début et fin)
  const mortalityRateData = {
    labels: twoPointLabels,
    datasets: [
      {
        label: 'Taux de mortalité (%)',
        data: [
          predictionStart && selectedCountryData ? (predictionStart.deaths / Number(selectedCountryData.population)) * 100 : 0,
          predictionEnd && selectedCountryData ? (predictionEnd.deaths / Number(selectedCountryData.population)) * 100 : 0
        ],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
        fill: false
      }
    ]
  };

  // Graphique de prédiction du taux de mortalité (début et fin)
  const mortalityPredictionData = {
    labels: twoPointLabels,
    datasets: [
      {
        label: 'Prédiction du taux de mortalité (%)',
        data: [
          predictionStart && selectedCountryData ? (predictionStart.deaths_upper / Number(selectedCountryData.population)) * 100 : 0,
          predictionEnd && selectedCountryData ? (predictionEnd.deaths_upper / Number(selectedCountryData.population)) * 100 : 0
        ],
        borderColor: 'rgba(255, 99, 132, 0.5)',
        borderDash: [5, 5],
        tension: 0.1,
        fill: false
      }
    ]
  };

  // Graphique de taux de rétablissement (début et fin)
  const recoveryRateData = {
    labels: twoPointLabels,
    datasets: [
      {
        label: 'Taux de rétablissement (%)',
        data: [
          predictionStart && selectedCountryData ? ((predictionStart.yhat - predictionStart.deaths) / Number(selectedCountryData.population)) * 100 : 0,
          predictionEnd && selectedCountryData ? ((predictionEnd.yhat - predictionEnd.deaths) / Number(selectedCountryData.population)) * 100 : 0
        ],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: false
      }
    ]
  };

  // Graphique de prédiction du taux de rétablissement (début et fin)
  const recoveryPredictionData = {
    labels: twoPointLabels,
    datasets: [
      {
        label: 'Prédiction du taux de rétablissement (%)',
        data: [
          predictionStart && selectedCountryData ? ((predictionStart.yhat_upper - predictionStart.deaths_upper) / Number(selectedCountryData.population)) * 100 : 0,
          predictionEnd && selectedCountryData ? ((predictionEnd.yhat_upper - predictionEnd.deaths_upper) / Number(selectedCountryData.population)) * 100 : 0
        ],
        borderColor: 'rgba(75, 192, 192, 0.5)',
        borderDash: [5, 5],
        tension: 0.1,
        fill: false
      }
    ]
  };

  // Fonction pour agréger les données par continent

  // Graphique des continents les plus touchés
  const mostAffectedContinentsData = {
    labels: continents.map((c: Continent) => c.name),
    datasets: [{
      label: 'Nombre total de cas par continent',
      data: continents.map((continent: Continent) => {
        const continentPredictions = predictions.filter(p => 
          getCountriesByContinent(continent.id).includes(p.id_country)
        );
        return continentPredictions.reduce((sum, p) => sum + p.yhat, 0);
      }),
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      borderColor: 'rgb(255, 99, 132)',
      borderWidth: 1
    }]
  };

  // Graphique de taux de mortalité par continent
  const mortalityRateByContinentData = {
    labels: twoPointLabels,
    datasets: continents.map((continent: Continent) => {
      const continentPredictions = predictions.filter(p => getCountriesByContinent(continent.id).includes(p.id_country));
      const start = continentPredictions[0];
      const end = continentPredictions[continentPredictions.length - 1];
      const getPop = (pred: Prediction | undefined) => {
        if (!pred) return 0;
        const country = countries.find(c => c.id_country === pred.id_country);
        return country ? Number(country.population) : 0;
      };
      return {
        label: `${continent.name}`,
        data: [
          start ? (start.deaths / getPop(start)) * 100 : 0,
          end ? (end.deaths / getPop(end)) * 100 : 0
        ],
        borderColor: `hsl(${continent.id * 60}, 70%, 50%)`,
        tension: 0.1,
        fill: false
      };
    })
  };

  // Graphique de prédiction du taux de mortalité par continent (début et fin)
  const mortalityPredictionByContinentData = {
    labels: twoPointLabels,
    datasets: continents.map((continent: Continent) => {
      const continentPredictions = predictions.filter(p => getCountriesByContinent(continent.id).includes(p.id_country));
      const start = continentPredictions[0];
      const end = continentPredictions[continentPredictions.length - 1];
      const getPop = (pred: Prediction | undefined) => {
        if (!pred) return 0;
        const country = countries.find(c => c.id_country === pred.id_country);
        return country ? Number(country.population) : 0;
      };
      return {
        label: `${continent.name}`,
        data: [
          start ? (start.deaths_upper / getPop(start)) * 100 : 0,
          end ? (end.deaths_upper / getPop(end)) * 100 : 0
        ],
        borderColor: `hsl(${continent.id * 60}, 70%, 50%)`,
        borderDash: [5, 5],
        tension: 0.1,
        fill: false
      };
    })
  };

  // Graphique de prédiction des continents les plus touchés (fin de période)
  const predictionByContinentData = {
    labels: continents.map((c: Continent) => c.name),
    datasets: [{
      label: 'Cas prédits à la fin de la période',
      data: continents.map((continent: Continent) => {
        const continentPredictions = predictions.filter(p => getCountriesByContinent(continent.id).includes(p.id_country));
        const end = continentPredictions[continentPredictions.length - 1];
        return end ? end.yhat : 0;
      }),
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgb(54, 162, 235)',
      borderWidth: 1
    }]
  };

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
          <div className="charts-grid">
            <ContinentBarChart data={mostAffectedContinentsData} options={chartOptions} />
            <ContinentPredictionBarChart data={predictionByContinentData} options={chartOptions} />
            <ContinentMortalityLineChart data={mortalityRateByContinentData} options={chartOptions} />
            <ContinentMortalityPredictionLineChart data={mortalityPredictionByContinentData} options={chartOptions} />
            <CountryMortalityLineChart data={mortalityRateData} options={chartOptions} countryName={selectedCountryNameFr} />
            <CountryMortalityPredictionLineChart data={mortalityPredictionData} options={chartOptions} countryName={selectedCountryNameFr} />
            <CountryRecoveryLineChart data={recoveryRateData} options={chartOptions} countryName={selectedCountryNameFr} />
            <CountryRecoveryPredictionLineChart data={recoveryPredictionData} options={chartOptions} countryName={selectedCountryNameFr} />
          </div>
        </>
      )}
    </div>
  );
};

export default Predictions; 
