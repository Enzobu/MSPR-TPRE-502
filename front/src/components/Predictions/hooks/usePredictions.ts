import { useState } from 'react';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import type { Prediction } from '../../../types/types';

export function usePredictions() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const authHeader = useAuthHeader();

  const fetchPredictions = async (startDate: string, endDate: string, selectedCountry: number | null) => {
    if (!authHeader) {
      setError('Non authentifié');
      return;
    }
    if (!startDate || !endDate) {
      setError('Veuillez sélectionner une période');
      return;
    }
    if (!selectedCountry) {
      setError('Veuillez sélectionner un pays');
      return;
    }
    try {
      setLoading(true);
      const url = `${import.meta.env.VITE_API_URL}/swagger/predictions/get?disease_id=1&start_date=${startDate}&end_date=${endDate}&country_id=${selectedCountry}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        }
      });
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received from server');
      }
      setPredictions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la récupération des prédictions');
      setPredictions([]);
    } finally {
      setLoading(false);
    }
  };

  return { predictions, loading, error, fetchPredictions };
} 