import React from 'react';
import { Line } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';

interface ContinentMortalityLineChartProps {
  data: any;
  options: ChartOptions<'line'>;
}

const ContinentMortalityLineChart: React.FC<ContinentMortalityLineChartProps> = ({ data, options }) => (
  <div className="chart-container">
    <h3>Taux de mortalité par continent</h3>
    <Line data={data} options={options} />
  </div>
);

export default ContinentMortalityLineChart; 