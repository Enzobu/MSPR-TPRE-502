import { useState } from 'react';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';

export interface Metrics {
  id_metrics: number;
  _date: string;
  rmse: number;
  mae: number;
  r2: number;
  rmse_bis: number;
  mae_bis: number;
  r2_bis: number;
  continent: string;
  continent_r2: number;
  continent_r2_bis: number;
}

export const useMetrics = () => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const authHeader = useAuthHeader();

  const fetchMetrics = async (countryId: number) => {
    setLoading(true);
    setError(null);
    try {
      if (!authHeader) {
        throw new Error("Token d'authentification manquant");
      }
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/swagger/metrics/get?id_country=${countryId}`,
        {
          method: 'GET',
          headers: {
            Authorization: authHeader,
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const data: Metrics = await response.json();
      setMetrics(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erreur lors de la récupération des métriques'
      );
      setMetrics(null);
    } finally {
      setLoading(false);
    }
  };

  return { metrics, loading, error, fetchMetrics };
}; 