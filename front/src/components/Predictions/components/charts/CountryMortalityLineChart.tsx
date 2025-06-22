import React from 'react';
import { Line } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';

interface CountryMortalityLineChartProps {
  data: any;
  options: ChartOptions<'line'>;
  countryName: string;
}

const CountryMortalityLineChart: React.FC<CountryMortalityLineChartProps> = ({ data, options, countryName }) => (
  <div className="chart-container">
    <h3>Taux de mortalité {countryName}</h3>
    <Line data={data} options={options} />
  </div>
);

export default CountryMortalityLineChart; 