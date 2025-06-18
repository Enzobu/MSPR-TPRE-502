import { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
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
import { format, addDays} from 'date-fns';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import type { Prediction, Country } from '../../types/types';
import { countryTranslations } from '../../data/countryTranslations';
import { continents, getCountriesByContinent, type Continent } from '../../data/continents';
import './Predictions.css';

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
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const authHeader = useAuthHeader();

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      if (!authHeader) {
        setError('Non authentifié');
        return;
      }

      try {
        const response = await fetch('http://qg.enzo-palermo.com:5001/swagger/countries', {
          headers: {
            'Authorization': authHeader,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch countries');
        }

        const data = await response.json();
        // Sort countries by translated name
        const sortedCountries = data.sort((a: Country, b: Country) => {
          const nameA = countryTranslations[a.name.toLowerCase()] || a.name;
          const nameB = countryTranslations[b.name.toLowerCase()] || b.name;
          return nameA.localeCompare(nameB);
        });
        setCountries(sortedCountries);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    };

    fetchCountries();
  }, [authHeader]);

  const handleDateChange = (date: string, isStart: boolean) => {
    if (isStart) {
      setStartDate(date);
      if (endDate && date > endDate) {
        setEndDate(date);
      }
    } else {
      setEndDate(date);
    }
  };

  const fetchPredictions = async () => {
    if (!authHeader) {
      console.error('No auth header available');
      setError('Non authentifié');
      return;
    }

    if (!startDate || !endDate) {
      console.error('Missing dates');
      setError('Veuillez sélectionner une période');
      return;
    }

    if (!selectedCountry) {
      console.error('No country selected');
      setError('Veuillez sélectionner un pays');
      return;
    }

    try {
      setLoading(true);
      const url = `http://qg.enzo-palermo.com:5001/swagger/predictions?disease_id=1&start_date=${startDate}&end_date=${endDate}&country_id=${selectedCountry}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch predictions: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Received data:', data);

      if (!Array.isArray(data)) {
        console.error('Invalid data format:', data);
        throw new Error('Invalid data format received from server');
      }

      setPredictions(data);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filteredPredictions = predictions.filter(p => p.id_country === selectedCountry);
  console.log('Filtered predictions:', filteredPredictions);

  const selectedCountryData = countries.find(c => c.id_country === selectedCountry);
  console.log('Selected country data:', selectedCountryData);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('fr-FR').format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {
            return new Intl.NumberFormat('fr-FR').format(value);
          }
        }
      }
    }
  };

  // Fonction utilitaire pour capitaliser la première lettre
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

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
      <div className="predictions-controls">
        <div className="date-controls">
          <label>
            Date de début:
            <input
              type="date"
              value={startDate}
              onChange={(e) => handleDateChange(e.target.value, true)}
              min={format(addDays(new Date(), 1), 'yyyy-MM-dd')}
            />
          </label>
          <label>
            Date de fin:
            <input
              type="date"
              value={endDate}
              onChange={(e) => handleDateChange(e.target.value, false)}
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
              onChange={(e) => setSelectedCountry(Number(e.target.value))}
            >
              <option value="">Sélectionnez un pays</option>
              {countries.map((country) => (
                <option key={country.id_country} value={country.id_country}>
                  {countryTranslations[country.name.toLowerCase()] || country.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button
          onClick={fetchPredictions}
          disabled={!startDate || !endDate || !selectedCountry}
          className="fetch-button"
        >
          Afficher les prédictions
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading">Chargement...</div>}

      {!loading && !error && predictions.length > 0 && (
        <>
          {selectedCountryData && (
            <div className="country-summary">
              <h2>Résumé du pays sélectionné</h2>
              <ul>
                <li><strong>Pays :</strong> {selectedCountryNameFr}</li>
                <li><strong>Population :</strong> {selectedCountryData.population ? Number(selectedCountryData.population).toLocaleString('fr-FR') : 'N/A'}</li>
                <li><strong>PIB :</strong> {selectedCountryData.pib ? Number(selectedCountryData.pib).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }) : 'N/A'}</li>
                {/* Ajoute ici d'autres infos si disponibles dans Country */}
              </ul>
            </div>
          )}
          <div className="charts-grid">

            <div className="chart-container">
              <h3>Continents les plus touchés</h3>
              <Bar data={mostAffectedContinentsData} options={chartOptions} />
            </div>

            <div className="chart-container">
              <h3>Prédiction des continents les plus touchés</h3>
              <Bar data={predictionByContinentData} options={chartOptions} />
            </div>

            <div className="chart-container">
              <h3>Taux de mortalité par continent</h3>
              <Line data={mortalityRateByContinentData} options={chartOptions} />
            </div>

            <div className="chart-container">
              <h3>Prédiction du taux de mortalité par continent</h3>
              <Line data={mortalityPredictionByContinentData} options={chartOptions} />
            </div>

            <div className="chart-container">
              <h3>Taux de mortalité {selectedCountryNameFr}</h3>
              <Line data={mortalityRateData} options={chartOptions} />
            </div>

            <div className="chart-container">
              <h3>Prédiction du taux de mortalité {selectedCountryNameFr}</h3>
              <Line data={mortalityPredictionData} options={chartOptions} />
            </div>

            <div className="chart-container">
              <h3>Taux de rétablissement {selectedCountryNameFr}</h3>
              <Line data={recoveryRateData} options={chartOptions} />
            </div>

            <div className="chart-container">
              <h3>Prédiction du taux de rétablissement {selectedCountryNameFr}</h3>
              <Line data={recoveryPredictionData} options={chartOptions} />
            </div>

          </div>
        </>
      )}
    </div>
  );
};

export default Predictions; 