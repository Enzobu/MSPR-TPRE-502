import { useState } from "react";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

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

export function useTransmission() {
  const [transmissionRate, setTransmissionRate] =
    useState<TransmissionRateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const authHeader = useAuthHeader();

  const fetchTransmissionRate = async (
    startDate: string,
    endDate: string,
    countryId: number,
    diseaseId: number = 1
  ) => {
    setLoading(true);
    setError(null);

    try {
      if (!authHeader) {
        throw new Error("Token d'authentification manquant");
      }

      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/swagger/predictions/transmission-rate?disease_id=${diseaseId}&start_date=${startDate}&end_date=${endDate}&country_id=${countryId}`,
        {
          method: "GET",
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data: TransmissionRateResponse = await response.json();
      setTransmissionRate(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de la récupération du taux de transmission"
      );
      setTransmissionRate(null);
    } finally {
      setLoading(false);
    }
  };

  return { transmissionRate, loading, error, fetchTransmissionRate };
}
