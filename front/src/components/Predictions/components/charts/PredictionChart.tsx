import React from 'react';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';
import type { Prediction } from '../../../../types/types';

interface PredictionChartProps {
  predictions: Prediction[];
  countryName: string;
}

const PredictionChart: React.FC<PredictionChartProps> = ({ predictions, countryName }) => {
  const chartData = {
    labels: predictions.map(p => format(new Date(p.ds), 'dd/MM/yyyy')),
    datasets: [
      {
        label: `Prédictions pour ${countryName}`,
        data: predictions.map(p => p.yhat),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
        fill: false,
        pointRadius: 3,
        pointHoverRadius: 5
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Évolution des prédictions - ${countryName}`,
        font: {
          size: 16
        }
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Nombre de cas prédits'
        },
        beginAtZero: true
      }
    }
  };

  return (
    <div className="chart-container" style={{ height: '400px', marginTop: '2rem' }}>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default PredictionChart; 