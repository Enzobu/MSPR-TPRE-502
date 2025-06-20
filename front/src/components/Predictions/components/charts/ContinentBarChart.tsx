import React from 'react';
import { Bar } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';

interface ContinentBarChartProps {
  data: any;
  options: ChartOptions<'bar'>;
}

const ContinentBarChart: React.FC<ContinentBarChartProps> = ({ data, options }) => (
  <div className="chart-container">
    <h3>Continents les plus touchés</h3>
    <Bar data={data} options={options} />
  </div>
);

export default ContinentBarChart; 