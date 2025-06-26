import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, AlertCircle } from 'lucide-react';
import { countryTranslations } from '../../data/countryTranslations';
import { useCountries } from './hooks/useCountries';
import { usePredictions } from './hooks/usePredictions';
import { capitalize } from './utils/capitalize';
import CountrySummary from './components/CountrySummary';
import PredictionChart from './components/charts/PredictionChart';
import PredictionsControls from './components/PredictionsControls';
import Layout from '../Layout/Layout';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Predictions: React.FC = () => {
  const { countries } = useCountries();
  const { predictions, loading: predictionsLoading, error: predictionsError, fetchPredictions } = usePredictions();
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);

  const filteredPredictions = selectedCountry ? predictions.filter(p => p.id_country === selectedCountry) : [];
  const selectedCountryData = selectedCountry ? countries.find(c => c.id_country === selectedCountry) : null;
  const selectedCountryNameFr = selectedCountryData ? capitalize(countryTranslations[selectedCountryData.name.toLowerCase()] || selectedCountryData.name) : '';

  const handleFetch = (startDate: string, endDate: string, countryId: number) => {
    fetchPredictions(startDate, endDate, countryId);
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 space-y-6">
      {/* En-tête */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Prédictions de Santé</h1>
        <p className="text-muted-foreground">
          Analysez les tendances et prédictions de santé publique par pays
        </p>
      </div>

      {/* Contrôles de prédiction avec calendrier stylé */}
      <PredictionsControls
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        countries={countries}
        onFetch={handleFetch}
        disabled={predictionsLoading}
      />

      {/* Messages d'erreur */}
      {predictionsError && (
        <Card className="border-destructive">
          <CardContent className="flex items-center space-x-3 py-4">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
            <div>
              <p className="font-medium text-destructive">Erreur lors de la génération</p>
              <p className="text-sm text-muted-foreground">{predictionsError}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Résultats */}
      {!predictionsLoading && !predictionsError && predictions.length > 0 && (
        <div className="space-y-6">
          {/* Résumé du pays */}
          {selectedCountryData && (
            <CountrySummary country={selectedCountryData} />
          )}
          
          {/* Graphique des prédictions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Évolution des prédictions</span>
                <Badge variant="outline">
                  {filteredPredictions.length} points de données
                </Badge>
              </CardTitle>
              <CardDescription>
                Visualisation des prédictions pour {selectedCountryNameFr}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PredictionChart 
                predictions={filteredPredictions} 
                countryName={selectedCountryNameFr} 
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* État vide */}
      {!predictionsLoading && !predictionsError && predictions.length === 0 && startDate && endDate && selectedCountry && (
        <Card>
          <CardContent className="text-center py-8">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune prédiction disponible</h3>
            <p className="text-muted-foreground">
              Aucune donnée trouvée pour les paramètres sélectionnés
            </p>
          </CardContent>
        </Card>
      )}
      </div>
    </Layout>
  );
};

export default Predictions;
