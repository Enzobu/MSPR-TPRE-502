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
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Globe, TrendingUp, AlertCircle } from 'lucide-react';
import { countryTranslations } from '../../data/countryTranslations';
import { useCountries } from './hooks/useCountries';
import { usePredictions } from './hooks/usePredictions';
import { capitalize } from './utils/capitalize';
import CountrySummary from './components/CountrySummary';
import PredictionChart from './components/charts/PredictionChart';
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

  const handleFetch = () => {
    fetchPredictions(startDate, endDate, selectedCountry);
  };

  const isFormValid = startDate && endDate && selectedCountry;

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

      {/* Contrôles de prédiction */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Paramètres de prédiction</span>
          </CardTitle>
          <CardDescription>
            Sélectionnez une période et un pays pour générer des prédictions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Date de début */}
            <div className="space-y-2">
              <Label htmlFor="start-date" className="flex items-center space-x-2">
                <CalendarDays className="h-4 w-4" />
                <span>Date de début</span>
              </Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Date de fin */}
            <div className="space-y-2">
              <Label htmlFor="end-date" className="flex items-center space-x-2">
                <CalendarDays className="h-4 w-4" />
                <span>Date de fin</span>
              </Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Sélection du pays */}
            <div className="space-y-2">
              <Label className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>Pays</span>
              </Label>
              <Select
                value={selectedCountry?.toString() || ""}
                onValueChange={(value) => setSelectedCountry(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un pays" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.id_country} value={country.id_country.toString()}>
                      {capitalize(countryTranslations[country.name.toLowerCase()] || country.name)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <Button 
              onClick={handleFetch} 
              disabled={!isFormValid || predictionsLoading}
              className="px-8"
            >
              {predictionsLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Génération...
                </>
              ) : (
                <>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Générer les prédictions
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

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
      {!predictionsLoading && !predictionsError && predictions.length === 0 && isFormValid && (
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
