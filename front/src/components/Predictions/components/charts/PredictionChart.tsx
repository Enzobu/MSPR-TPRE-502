import React from 'react';
import { Line } from 'react-chartjs-2';
import type { Prediction } from '../../../../types/types';

interface PredictionChartProps {
  predictions: Prediction[];
  countryName: string;
}

const PredictionChart: React.FC<PredictionChartProps> = ({ predictions, countryName }) => {
  const chartData = {
    labels: predictions.map(p => new Date(p.ds).toLocaleDateString('fr-FR')),
    datasets: [
      {
        label: `Prédictions pour ${countryName}`,
        data: predictions.map(p => p.yhat),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
        fill: false,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `Évolution des prédictions - ${countryName}`,
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      legend: {
        display: true,
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Valeurs prédites',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
    },
  };

  return (
    <div className="w-full h-96 mt-8">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default PredictionChart; 