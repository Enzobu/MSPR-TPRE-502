import React from 'react';
import { Line } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';

interface ContinentMortalityPredictionLineChartProps {
  data: any;
  options: ChartOptions<'line'>;
}

const ContinentMortalityPredictionLineChart: React.FC<ContinentMortalityPredictionLineChartProps> = ({ data, options }) => (
  <div className="chart-container">
    <h3>Prédiction du taux de mortalité par continent</h3>
    <Line data={data} options={options} />
  </div>
);

export default ContinentMortalityPredictionLineChart; 