import React from "react";
import { Line } from "react-chartjs-2";
import { type TooltipItem } from "chart.js";

interface TransmissionRateData {
  [date: string]: number;
}

interface TransmissionRateResponse {
  country_id: string;
  disease_id: string;
  start_date: string;
  end_date: string;
  transmission_rate: TransmissionRateData[];
}

interface TransmissionRateChartProps {
  transmissionRate: TransmissionRateResponse;
  countryName: string;
}

const TransmissionRateChart: React.FC<TransmissionRateChartProps> = ({
  transmissionRate,
  countryName,
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  console.log(transmissionRate);

  // Transformer les données pour faciliter le traitement
  const transformedData = transmissionRate.transmission_rate.map((item) => {
    const date = Object.keys(item)[0];
    const rate = Object.values(item)[0];
    return { date, rate };
  });

  // Trier par date
  transformedData.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const chartData = {
    labels: transformedData.map((item) =>
      new Date(item.date).toLocaleDateString("fr-FR")
    ),
    datasets: [
      {
        label: `Données historiques - ${countryName}`,
        data: transformedData.map((item) => {
          const date = new Date(item.date);
          return date <= today ? item.rate : null;
        }),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.1,
        fill: false,
        pointRadius: 3,
        pointHoverRadius: 5,
        spanGaps: true,
      },
      {
        label: `Taux de transmission prédit - ${countryName}`,
        data: transformedData.map((item) => {
          const date = new Date(item.date);
          return date > today ? item.rate : null;
        }),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.1,
        fill: false,
        pointRadius: 3,
        pointHoverRadius: 5,
        spanGaps: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<"line">) {
            const label = context.dataset.label || "";
            const value = context.parsed.y;
            return `${label}: ${(value * 100).toFixed(2)} %`;
          },
        },
      },
      title: {
        display: true,
        text: `Évolution du taux de transmission - ${countryName}`,
        font: {
          size: 16,
          weight: "bold" as const,
        },
      },
      legend: {
        display: true,
        position: "top" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Taux de transmission",
        },
        ticks: {
          callback: function (value: any) {
            return (value * 100).toFixed(2) + "%";
          },
        },
      },
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
    },
  };

  return (
    <div className="w-full h-96 mt-8" data-testid="prediction-chart-container">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default TransmissionRateChart;
