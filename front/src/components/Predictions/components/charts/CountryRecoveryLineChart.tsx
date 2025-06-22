import React from 'react';
import { Line } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';

interface CountryRecoveryLineChartProps {
  data: any;
  options: ChartOptions<'line'>;
  countryName: string;
}

const CountryRecoveryLineChart: React.FC<CountryRecoveryLineChartProps> = ({ data, options, countryName }) => (
  <div className="chart-container">
    <h3>Taux de rétablissement {countryName}</h3>
    <Line data={data} options={options} />
  </div>
);

export default CountryRecoveryLineChart; 