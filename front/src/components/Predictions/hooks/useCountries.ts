import { useState, useEffect } from 'react';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import type { Country } from '../../../types/types';
import { countryTranslations } from '../../../data/countryTranslations';

export function useCountries() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const authHeader = useAuthHeader();

  useEffect(() => {
    const fetchCountries = async () => {
      if (!authHeader) {
        setError('Non authentifié');
        return;
      }
      try {
        setLoading(true);
        const response = await fetch('http://qg.enzo-palermo.com:5001/swagger/countries', {
          headers: {
            'Authorization': authHeader,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch countries');
        }
        const data = await response.json();
        const sortedCountries = data.sort((a: Country, b: Country) => {
          const nameA = countryTranslations[a.name.toLowerCase()] || a.name;
          const nameB = countryTranslations[b.name.toLowerCase()] || b.name;
          return nameA.localeCompare(nameB);
        });
        setCountries(sortedCountries);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, [authHeader]);

  return { countries, loading, error };
} 