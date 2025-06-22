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
      const url = `http://qg.enzo-palermo.com:5001/swagger/predictions?disease_id=1&start_date=${startDate}&end_date=${endDate}&country_id=${selectedCountry}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch predictions: ${response.status} ${errorText}`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received from server');
      }
      setPredictions(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { predictions, loading, error, fetchPredictions };
} 