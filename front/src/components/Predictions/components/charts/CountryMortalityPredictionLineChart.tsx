import React from 'react';
import { Line } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';

interface CountryMortalityPredictionLineChartProps {
  data: any;
  options: ChartOptions<'line'>;
  countryName: string;
}

const CountryMortalityPredictionLineChart: React.FC<CountryMortalityPredictionLineChartProps> = ({ data, options, countryName }) => (
  <div className="chart-container">
    <h3>Prédiction du taux de mortalité {countryName}</h3>
    <Line data={data} options={options} />
  </div>
);

export default CountryMortalityPredictionLineChart; 