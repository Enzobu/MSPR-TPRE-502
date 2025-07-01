import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TransmissionRateChart from "./TransmissionRateChart";

// Mock de react-chartjs-2
vi.mock("react-chartjs-2", () => ({
  Line: ({ data, options }: any) => (
    <div data-testid="prediction-chart">
      <div data-testid="chart-data">{JSON.stringify(data)}</div>
      <div data-testid="chart-options">{JSON.stringify(options)}</div>
    </div>
  ),
}));

describe("PredictionChart", () => {
  const mockTransmission = {
    country_id: "1",
    disease_id: "1",
    start_date: "2024-01-01",
    end_date: "2024-01-03",
    transmission_rate: [
      { "2024-01-01": 0.018808039797055132 } as { [date: string]: number },
      { "2024-01-02": 0.018808039797055132 } as { [date: string]: number },
      { "2024-01-03": 0.018808039797055132 } as { [date: string]: number },
    ],
  };

  const defaultProps = {
    transmissionRate: mockTransmission,
    countryName: "France",
  };

  it("devrait rendre le graphique", () => {
    render(<TransmissionRateChart {...defaultProps} />);

    expect(screen.getByTestId("prediction-chart")).toBeInTheDocument();
  });

  it("devrait afficher le titre correct avec le nom du pays", () => {
    render(<TransmissionRateChart {...defaultProps} />);

    const chartOptions = JSON.parse(
      screen.getByTestId("chart-options").textContent || "{}"
    );
    expect(chartOptions.plugins.title.text).toBe(
      "Évolution du taux de transmission - France"
    );
  });

  it("devrait afficher le titre avec un nom de pays différent", () => {
    render(<TransmissionRateChart {...defaultProps} countryName="Allemagne" />);

    const chartOptions = JSON.parse(
      screen.getByTestId("chart-options").textContent || "{}"
    );
    expect(chartOptions.plugins.title.text).toBe(
      "Évolution du taux de transmission - Allemagne"
    );
  });

  it("devrait gérer les données vides", () => {
    const emptyData = {
      country_id: "1",
      disease_id: "1",
      start_date: "2024-01-01",
      end_date: "2024-01-01",
      transmission_rate: [],
    };

    render(
      <TransmissionRateChart
        transmissionRate={emptyData}
        countryName="France"
      />
    );

    const chartData = JSON.parse(
      screen.getByTestId("chart-data").textContent || "{}"
    );
    expect(chartData.labels).toEqual([]);
  });

  it("devrait formater correctement les dates dans les étiquettes", () => {
    render(<TransmissionRateChart {...defaultProps} />);

    const chartData = JSON.parse(
      screen.getByTestId("chart-data").textContent || "{}"
    );
    expect(chartData.labels).toEqual([
      "01/01/2024",
      "02/01/2024",
      "03/01/2024",
    ]);
  });

  it("devrait avoir le bon label pour le dataset", () => {
    render(<TransmissionRateChart {...defaultProps} />);

    const chartData = JSON.parse(
      screen.getByTestId("chart-data").textContent || "{}"
    );
    expect(chartData.datasets[0].label).toBe("Données historiques - France");
  });

  it("devrait avoir le bon style du graphique", () => {
    render(<TransmissionRateChart {...defaultProps} />);

    const chartData = JSON.parse(
      screen.getByTestId("chart-data").textContent || "{}"
    );
    const dataset = chartData.datasets[0];

    expect(dataset.borderColor).toBe("rgb(75, 192, 192)");
    expect(dataset.backgroundColor).toBe("rgba(75, 192, 192, 0.2)");
    expect(dataset.tension).toBe(0.1);
    expect(dataset.fill).toBe(false);
    expect(dataset.pointRadius).toBe(3);
    expect(dataset.pointHoverRadius).toBe(5);
  });

  it("devrait avoir le conteneur avec les bonnes classes CSS", () => {
    render(<TransmissionRateChart {...defaultProps} />);

    const container = screen.getByTestId("prediction-chart-container");
    expect(container).toHaveClass("w-full", "h-96", "mt-8");
  });

  it("devrait avoir les bonnes options de configuration", () => {
    render(<TransmissionRateChart {...defaultProps} />);

    const chartOptions = JSON.parse(
      screen.getByTestId("chart-options").textContent || "{}"
    );

    expect(chartOptions.responsive).toBe(true);
    expect(chartOptions.maintainAspectRatio).toBe(false);
    expect(chartOptions.plugins.title.display).toBe(true);
    expect(chartOptions.plugins.legend.display).toBe(true);
    expect(chartOptions.plugins.legend.position).toBe("top");
    expect(chartOptions.scales.y.beginAtZero).toBe(true);
    expect(chartOptions.scales.y.title.text).toBe("Taux de transmission");
    expect(chartOptions.scales.x.title.text).toBe("Date");
  });

  it("devrait avoir deux datasets (historique et futur)", () => {
    render(<TransmissionRateChart {...defaultProps} />);

    const chartData = JSON.parse(
      screen.getByTestId("chart-data").textContent || "{}"
    );
    expect(chartData.datasets).toHaveLength(2);
    expect(chartData.datasets[0].label).toBe("Données historiques - France");
    expect(chartData.datasets[1].label).toBe("Taux de transmission prédit - France");
  });

  it("devrait avoir les bonnes couleurs pour les datasets", () => {
    render(<TransmissionRateChart {...defaultProps} />);

    const chartData = JSON.parse(
      screen.getByTestId("chart-data").textContent || "{}"
    );
    expect(chartData.datasets[0].borderColor).toBe("rgb(75, 192, 192)"); // Bleu pour historique
    expect(chartData.datasets[1].borderColor).toBe("rgb(255, 99, 132)"); // Rouge pour futur
  });
});
