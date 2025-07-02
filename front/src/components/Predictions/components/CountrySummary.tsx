import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Users, DollarSign, Globe, Flag, Activity } from 'lucide-react';
import { getFlagEmojiFromIso3 } from '../../../utils/flagUtils';
import { countryTranslations } from '../../../data/countryTranslations';
import { capitalize, capitalizeEachWord } from '../utils/capitalize';
import type { Country } from '../../../types/types';
import type { Metrics } from '../hooks/useMetrics';
import { formatNumberWithSpaces } from '../utils/numbers';

interface CountrySummaryProps {
  country: Country;
  metrics?: Metrics | null;
}

const CountrySummary: React.FC<CountrySummaryProps> = ({ country, metrics }) => {    
  const formatNumber = (num: string | undefined) => {
    if (!num) return 'N/A';
    return new Intl.NumberFormat('fr-FR').format(Number(num));
  };

  const formatCurrency = (num: string | undefined) => {
    if (!num) return 'N/A';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(Number(num));
  };

  const formatCoordinate = (coord: string | undefined) => {
    if (!coord) return 'N/A';
    return Number(coord).toFixed(2);
  };

  const flagEmoji = getFlagEmojiFromIso3(country.iso_code);
  const translatedName = capitalize(countryTranslations[country.name.toLowerCase()] || country.name);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-3">
            <div className="text-3xl">{flagEmoji}</div>
            <div>
              <h2 className="text-2xl font-bold">{translatedName}</h2>
              <p className="text-muted-foreground text-sm">
                Code ISO: {country.iso_code}
              </p>
            </div>
          </CardTitle>
          <Badge variant="outline" className="flex items-center space-x-1">
            <Globe className="h-3 w-3" />
            <span>Continent : {metrics ? capitalizeEachWord(metrics.continent) : "N/A"}</span>
          </Badge>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Population */}
          <div className="flex items-center space-x-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-full">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Population</p>
              <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                {formatNumber(country.population)}
              </p>
            </div>
          </div>

          {/* PIB */}
          <div className="flex items-center space-x-3 p-4 rounded-lg bg-green-50 dark:bg-green-950/20">
            <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-full">
              <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">PIB</p>
              <p className="text-lg font-bold text-green-700 dark:text-green-300">
                {formatCurrency(country.pib)}
              </p>
            </div>
          </div>

          {/* Latitude */}
          <div className="flex items-center space-x-3 p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/40 rounded-full">
              <MapPin className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Latitude</p>
              <p className="text-lg font-bold text-orange-700 dark:text-orange-300">
                {formatCoordinate(country.latitude)}°
              </p>
            </div>
          </div>

          {/* Longitude */}
          <div className="flex items-center space-x-3 p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-full">
              <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Longitude</p>
              <p className="text-lg font-bold text-purple-700 dark:text-purple-300">
                {formatCoordinate(country.longitude)}°
              </p>
            </div>
          </div>
        </div>

        {/* Informations supplémentaires */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <Flag className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold">Informations géographiques</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Coordonnées:</span>{' '}
              <span className="text-muted-foreground">
                {country.latitude ? Number(country.latitude).toFixed(4) : 'N/A'}°N, {country.longitude ? Number(country.longitude).toFixed(4) : 'N/A'}°E
              </span>
            </div>
            <div>
              <span className="font-medium">Code ISO:</span>{' '}
              <Badge variant="secondary" className="ml-1">
                {country.iso_code}
              </Badge>
            </div>
          </div>
        </div>

        {/* METRICS */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold">Métriques</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">RMSE:</span>{' '}
              <span className="text-muted-foreground">
                {metrics ? formatNumberWithSpaces(metrics.rmse) : 'N/A'}
              </span>
            </div>
            <div>
              <span className="font-medium">MAE:</span>{' '}
              <span className="text-muted-foreground">
                {metrics ? formatNumberWithSpaces(metrics.mae) : 'N/A'}
              </span>
            </div>
            <div>
              <span className="font-medium">R2 Pays:</span>{' '}
              <span className="text-muted-foreground">
              {metrics ? (metrics.r2 * 100).toFixed(2) + ' %' : 'N/A'}
              </span>
            </div>
            <div>
              <span className="font-medium">R2 Continent:</span>{' '}
              <span className="text-muted-foreground">
              {metrics ? (metrics.continent_r2 * 100).toFixed(2) + ' %' : 'N/A'}
              </span>
            </div>
          </div>
          <br />

          <div className="flex items-center space-x-2 mb-3">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold">Métriques "bis" <span className="text-xs text-muted-foreground">(basés uniquement sur les données à partir de 2022)</span></h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">RMSE bis:</span>{' '}
              <span className="text-muted-foreground">
                {metrics ? formatNumberWithSpaces(metrics.rmse_bis) : 'N/A'}
              </span>
            </div>
            <div>
              <span className="font-medium">MAE bis:</span>{' '}
              <span className="text-muted-foreground">
                {metrics ? formatNumberWithSpaces(metrics.mae_bis) : 'N/A'}
              </span>
            </div>
            <div>
              <span className="font-medium">R2 Pays bis:</span>{' '}
              <span className="text-muted-foreground">
              {metrics ? (metrics.r2_bis * 100).toFixed(2) + ' %' : 'N/A'}
              </span>
            </div>
            <div>
              <span className="font-medium">R2 Continent bis:</span>{' '}
              <span className="text-muted-foreground">
              {metrics ? (metrics.continent_r2_bis * 100).toFixed(2) + ' %' : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CountrySummary; 