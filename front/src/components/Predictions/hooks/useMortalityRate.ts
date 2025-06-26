import { useState } from 'react';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';

interface MortalityRateData {
  [date: string]: number;
}

interface MortalityRateResponse {
  country_id: string;
  disease_id: string;
  start_date: string;
  end_date: string;
  mortality_rate: MortalityRateData[];
}

export const useMortalityRate = () => {
  const [mortalityData, setMortalityData] = useState<MortalityRateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const authHeader = useAuthHeader();

  const fetchMortalityRate = async (
    startDate: string, 
    endDate: string, 
    countryId: number, 
    diseaseId: number = 1
  ) => {
    setLoading(true);
    setError(null);

    try {
      if (!authHeader) {
        throw new Error('Token d\'authentification manquant');
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/swagger/predictions/mortality-rate?disease_id=${diseaseId}&start_date=${startDate}&end_date=${endDate}&country_id=${countryId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data: MortalityRateResponse = await response.json();
      setMortalityData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la récupération du taux de mortalité');
      setMortalityData(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    mortalityData,
    loading,
    error,
    fetchMortalityRate,
  };
}; 