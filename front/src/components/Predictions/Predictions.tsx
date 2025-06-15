import { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { format, addDays, isAfter, isBefore } from 'date-fns';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import type { Prediction, Country } from '../../types/types';
import { countryTranslations } from '../../data/countryTranslations';
import './Predictions.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
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

  // Line chart data for predictions
  const lineChartData = {
    labels: filteredPredictions.map(p => format(new Date(p.ds), 'dd/MM/yyyy')),
    datasets: [
      {
        label: 'Nombre de cas prédits',
        data: filteredPredictions.map(p => p.yhat),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Limite supérieure de prédiction',
        data: filteredPredictions.map(p => p.yhat_upper),
        borderColor: 'rgba(75, 192, 192, 0.5)',
        borderDash: [5, 5],
        tension: 0.1,
      },
      {
        label: 'Limite inférieure de prédiction',
        data: filteredPredictions.map(p => p.yhat_lower),
        borderColor: 'rgba(75, 192, 192, 0.5)',
        borderDash: [5, 5],
        tension: 0.1,
      },
    ],
  };

  // Bar chart data for daily changes
  const barChartData = {
    labels: filteredPredictions.map(p => format(new Date(p.ds), 'dd/MM/yyyy')),
    datasets: [
      {
        label: 'Variation journalière (nouveaux cas)',
        data: filteredPredictions.map((p, i) =>
          i === 0 ? 0 : p.yhat - filteredPredictions[i - 1].yhat
        ),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  };

  // Incidence rate chart (cases per million inhabitants)
  const incidenceChartData = {
    labels: filteredPredictions.map(p => format(new Date(p.ds), 'dd/MM/yyyy')),
    datasets: [
      {
        label: 'Taux d\'incidence (cas par million d\'habitants)',
        data: filteredPredictions.map(p => {
          const population = selectedCountryData ? Number(selectedCountryData.population) : 0;
          return population > 0 ? (p.yhat / population) * 1000000 : 0;
        }),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 1,
      },
      {
        label: 'Limite supérieure (cas par million)',
        data: filteredPredictions.map(p => {
          const population = selectedCountryData ? Number(selectedCountryData.population) : 0;
          return population > 0 ? (p.yhat_upper / population) * 1000000 : 0;
        }),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 0.5)',
        borderWidth: 1,
        borderDash: [5, 5],
      },
      {
        label: 'Limite inférieure (cas par million)',
        data: filteredPredictions.map(p => {
          const population = selectedCountryData ? Number(selectedCountryData.population) : 0;
          return population > 0 ? (p.yhat_lower / population) * 1000000 : 0;
        }),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 0.5)',
        borderWidth: 1,
        borderDash: [5, 5],
      },
    ],
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

      {loading ? (
        <div>Chargement des prédictions...</div>
      ) : predictions.length > 0 && filteredPredictions.length > 0 ? (
        <div className="charts-container">
          <div className="chart-wrapper">
            <h3>Prédictions de cas COVID-19</h3>
            <p className="chart-description">
              Ce graphique montre le nombre total de cas COVID-19 prédits pour la période sélectionnée.
              Les lignes en pointillés représentent les limites supérieure et inférieure de la prédiction.
            </p>
            <div className="chart-container">
              <Line
                data={lineChartData}
                options={{
                  ...chartOptions,
                  scales: {
                    ...chartOptions.scales,
                    y: {
                      ...chartOptions.scales.y,
                      title: {
                        display: true,
                        text: 'Nombre total de cas'
                      }
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'Date (JJ/MM/AAAA)'
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
          <div className="chart-wrapper">
            <h3>Variations journalières des cas</h3>
            <p className="chart-description">
              Ce graphique montre le nombre de nouveaux cas quotidiens prédits.
              Une valeur positive indique une augmentation du nombre de cas par rapport au jour précédent.
            </p>
            <div className="chart-container">
              <Bar
                data={barChartData}
                options={{
                  ...chartOptions,
                  scales: {
                    ...chartOptions.scales,
                    y: {
                      ...chartOptions.scales.y,
                      title: {
                        display: true,
                        text: 'Nombre de nouveaux cas'
                      }
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'Date (JJ/MM/AAAA)'
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
          <div className="chart-wrapper">
            <h3>Taux d'incidence (cas par million d'habitants)</h3>
            <p className="chart-description">
              Ce graphique montre le nombre de cas prédits par million d'habitants.
              Cette mesure permet de comparer l'impact de la pandémie entre des pays de tailles différentes.
            </p>
            <div className="chart-container">
              <Line
                data={incidenceChartData}
                options={{
                  ...chartOptions,
                  scales: {
                    ...chartOptions.scales,
                    y: {
                      ...chartOptions.scales.y,
                      title: {
                        display: true,
                        text: 'Cas par million d\'habitants'
                      }
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'Date (JJ/MM/AAAA)'
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      ) : predictions.length > 0 ? (
        <div className="error-message">
          Aucune donnée disponible pour le pays sélectionné sur cette période.
        </div>
      ) : null}
    </div>
  );
};

export default Predictions; 