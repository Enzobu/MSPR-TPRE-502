import React from 'react';
import { Line } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';

interface CountryRecoveryPredictionLineChartProps {
  data: any;
  options: ChartOptions<'line'>;
  countryName: string;
}

const CountryRecoveryPredictionLineChart: React.FC<CountryRecoveryPredictionLineChartProps> = ({ data, options, countryName }) => (
  <div className="chart-container">
    <h3>Prédiction du taux de rétablissement {countryName}</h3>
    <Line data={data} options={options} />
  </div>
);

export default CountryRecoveryPredictionLineChart; 