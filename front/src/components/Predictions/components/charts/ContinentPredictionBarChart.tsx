import React from 'react';
import { Bar } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';

interface ContinentPredictionBarChartProps {
  data: any;
  options: ChartOptions<'bar'>;
}

const ContinentPredictionBarChart: React.FC<ContinentPredictionBarChartProps> = ({ data, options }) => (
  <div className="chart-container">
    <h3>Prédiction des continents les plus touchés</h3>
    <Bar data={data} options={options} />
  </div>
);

export default ContinentPredictionBarChart; 