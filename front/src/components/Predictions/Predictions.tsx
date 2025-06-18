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
import { continents, getCountriesByContinent } from '../../data/continents';
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

  // Graphique de comparaison des pays les plus touchés
  const mostAffectedCountriesData = {
    labels: countries.map(c => countryTranslations[c.name.toLowerCase()] || c.name),
    datasets: [{
      label: 'Nombre total de cas',
      data: countries.map(country => {
        const countryPredictions = predictions.filter(p => p.id_country === country.id_country);
        return countryPredictions.reduce((sum, p) => sum + p.yhat, 0);
      }),
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      borderColor: 'rgb(255, 99, 132)',
      borderWidth: 1
    }]
  };

  // Graphique de prédiction par pays
  const predictionByCountryData = {
    labels: countries.map(c => countryTranslations[c.name.toLowerCase()] || c.name),
    datasets: [{
      label: 'Prédiction de cas',
      data: countries.map(country => {
        const countryPredictions = predictions.filter(p => p.id_country === country.id_country);
        return countryPredictions[countryPredictions.length - 1]?.yhat || 0;
      }),
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgb(54, 162, 235)',
      borderWidth: 1
    }]
  };

  // Graphique de vitesse de propagation
  const propagationSpeedData = {
    labels: filteredPredictions.map(p => format(new Date(p.ds), 'dd/MM/yyyy')),
    datasets: [{
      label: 'Vitesse de propagation (nouveaux cas par jour)',
      data: filteredPredictions.map((p, i) => 
        i === 0 ? 0 : p.yhat - filteredPredictions[i - 1].yhat
      ),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
      fill: false
    }]
  };

  // Graphique de taux de mortalité
  const mortalityRateData = {
    labels: filteredPredictions.map(p => format(new Date(p.ds), 'dd/MM/yyyy')),
    datasets: [{
      label: 'Taux de mortalité (%)',
      data: filteredPredictions.map(p => {
        const population = selectedCountryData ? Number(selectedCountryData.population) : 0;
        return population > 0 ? (p.deaths / population) * 100 : 0;
      }),
      borderColor: 'rgb(255, 99, 132)',
      tension: 0.1,
      fill: false
    }]
  };

  // Graphique de prédiction du taux de mortalité
  const mortalityPredictionData = {
    labels: filteredPredictions.map(p => format(new Date(p.ds), 'dd/MM/yyyy')),
    datasets: [{
      label: 'Prédiction du taux de mortalité (%)',
      data: filteredPredictions.map(p => {
        const population = selectedCountryData ? Number(selectedCountryData.population) : 0;
        return population > 0 ? (p.deaths_upper / population) * 100 : 0;
      }),
      borderColor: 'rgba(255, 99, 132, 0.5)',
      borderDash: [5, 5],
      tension: 0.1,
      fill: false
    }]
  };

  // Graphique de taux de rétablissement
  const recoveryRateData = {
    labels: filteredPredictions.map(p => format(new Date(p.ds), 'dd/MM/yyyy')),
    datasets: [{
      label: 'Taux de rétablissement (%)',
      data: filteredPredictions.map(p => {
        const population = selectedCountryData ? Number(selectedCountryData.population) : 0;
        const recovered = p.yhat - p.deaths;
        return population > 0 ? (recovered / population) * 100 : 0;
      }),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
      fill: false
    }]
  };

  // Graphique de prédiction du taux de rétablissement
  const recoveryPredictionData = {
    labels: filteredPredictions.map(p => format(new Date(p.ds), 'dd/MM/yyyy')),
    datasets: [{
      label: 'Prédiction du taux de rétablissement (%)',
      data: filteredPredictions.map(p => {
        const population = selectedCountryData ? Number(selectedCountryData.population) : 0;
        const recovered = p.yhat_upper - p.deaths_upper;
        return population > 0 ? (recovered / population) * 100 : 0;
      }),
      borderColor: 'rgba(75, 192, 192, 0.5)',
      borderDash: [5, 5],
      tension: 0.1,
      fill: false
    }]
  };

  // Fonction pour agréger les données par continent
  const aggregateDataByContinent = (predictions: Prediction[]) => {
    const continentData = new Map<number, {
      totalCases: number,
      totalDeaths: number,
      predictions: Prediction[]
    }>();

    // Initialiser les données pour chaque continent
    continents.forEach(continent => {
      continentData.set(continent.id, {
        totalCases: 0,
        totalDeaths: 0,
        predictions: []
      });
    });

    // Agréger les données
    predictions.forEach(prediction => {
      const continentId = continents.find(c => c.countries.includes(prediction.id_country))?.id;
      if (continentId) {
        const data = continentData.get(continentId)!;
        data.totalCases += prediction.yhat;
        data.totalDeaths += prediction.deaths;
        data.predictions.push(prediction);
      }
    });

    return continentData;
  };

  // Graphique des continents les plus touchés
  const mostAffectedContinentsData = {
    labels: continents.map(c => c.name),
    datasets: [{
      label: 'Nombre total de cas par continent',
      data: continents.map(continent => {
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

  // Graphique de prédiction par continent
  const predictionByContinentData = {
    labels: continents.map(c => c.name),
    datasets: [{
      label: 'Prédiction de cas par continent',
      data: continents.map(continent => {
        const continentPredictions = predictions.filter(p => 
          getCountriesByContinent(continent.id).includes(p.id_country)
        );
        return continentPredictions[continentPredictions.length - 1]?.yhat || 0;
      }),
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgb(54, 162, 235)',
      borderWidth: 1
    }]
  };

  // Graphique de vitesse de propagation par continent
  const propagationSpeedByContinentData = {
    labels: filteredPredictions.map(p => format(new Date(p.ds), 'dd/MM/yyyy')),
    datasets: continents.map(continent => ({
      label: `Vitesse de propagation - ${continent.name}`,
      data: filteredPredictions.map((_, index) => {
        const continentPredictions = predictions.filter(p => 
          getCountriesByContinent(continent.id).includes(p.id_country)
        );
        const currentDay = continentPredictions.filter(p => 
          format(new Date(p.ds), 'dd/MM/yyyy') === format(new Date(filteredPredictions[index].ds), 'dd/MM/yyyy')
        );
        const previousDay = continentPredictions.filter(p => 
          format(new Date(p.ds), 'dd/MM/yyyy') === format(new Date(filteredPredictions[index - 1]?.ds || filteredPredictions[index].ds), 'dd/MM/yyyy')
        );
        const currentTotal = currentDay.reduce((sum, p) => sum + p.yhat, 0);
        const previousTotal = previousDay.reduce((sum, p) => sum + p.yhat, 0);
        return index === 0 ? 0 : currentTotal - previousTotal;
      }),
      borderColor: `hsl(${continent.id * 60}, 70%, 50%)`,
      tension: 0.1,
      fill: false
    }))
  };

  // Graphique de taux de mortalité par continent
  const mortalityRateByContinentData = {
    labels: filteredPredictions.map(p => format(new Date(p.ds), 'dd/MM/yyyy')),
    datasets: continents.map(continent => ({
      label: `Taux de mortalité - ${continent.name}`,
      data: filteredPredictions.map(p => {
        const continentPredictions = predictions.filter(pred => 
          getCountriesByContinent(continent.id).includes(pred.id_country)
        );
        const dayPredictions = continentPredictions.filter(pred => 
          format(new Date(pred.ds), 'dd/MM/yyyy') === format(new Date(p.ds), 'dd/MM/yyyy')
        );
        const totalDeaths = dayPredictions.reduce((sum, pred) => sum + pred.deaths, 0);
        const totalPopulation = dayPredictions.reduce((sum, pred) => {
          const country = countries.find(c => c.id_country === pred.id_country);
          return sum + (country ? Number(country.population) : 0);
        }, 0);
        return totalPopulation > 0 ? (totalDeaths / totalPopulation) * 100 : 0;
      }),
      borderColor: `hsl(${continent.id * 60}, 70%, 50%)`,
      tension: 0.1,
      fill: false
    }))
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
        <div className="charts-grid">
          <div className="chart-container">
            <h3>Pays les plus touchés</h3>
            <Bar data={mostAffectedCountriesData} options={chartOptions} />
          </div>

          <div className="chart-container">
            <h3>Continents les plus touchés</h3>
            <Bar data={mostAffectedContinentsData} options={chartOptions} />
          </div>

          <div className="chart-container">
            <h3>Prédiction par pays</h3>
            <Bar data={predictionByCountryData} options={chartOptions} />
          </div>

          <div className="chart-container">
            <h3>Prédiction par continent</h3>
            <Bar data={predictionByContinentData} options={chartOptions} />
          </div>

          <div className="chart-container">
            <h3>Vitesse de propagation par pays</h3>
            <Line data={propagationSpeedData} options={chartOptions} />
          </div>

          <div className="chart-container">
            <h3>Vitesse de propagation par continent</h3>
            <Line data={propagationSpeedByContinentData} options={chartOptions} />
          </div>

          <div className="chart-container">
            <h3>Taux de mortalité par pays</h3>
            <Line data={mortalityRateData} options={chartOptions} />
          </div>

          <div className="chart-container">
            <h3>Taux de mortalité par continent</h3>
            <Line data={mortalityRateByContinentData} options={chartOptions} />
          </div>

          <div className="chart-container">
            <h3>Prédiction du taux de mortalité par pays</h3>
            <Line data={mortalityPredictionData} options={chartOptions} />
          </div>

          <div className="chart-container">
            <h3>Taux de rétablissement par pays</h3>
            <Line data={recoveryRateData} options={chartOptions} />
          </div>

          <div className="chart-container">
            <h3>Prédiction du taux de rétablissement par pays</h3>
            <Line data={recoveryPredictionData} options={chartOptions} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Predictions; 