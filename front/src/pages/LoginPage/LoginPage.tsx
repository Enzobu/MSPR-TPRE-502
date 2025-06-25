import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import UserLogin from '../../components/UserLogin/UserLogin';
import whoEmblem from '../../assets/who-emblem.svg';
import whoBackground from '../../assets/who_background.jpg';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
        style={{ backgroundImage: `url(${whoBackground})` }}
      />
      
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800" />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img src={whoEmblem} alt="WHO Logo" className="h-12 w-12" />
            <div>
              <h1 className="text-2xl font-bold text-primary">AnalyzeIt</h1>
              <Badge variant="outline" className="text-xs">
                <Activity className="h-3 w-3 mr-1" />
                WHO Platform
              </Badge>
            </div>
          </div>
          <p className="text-muted-foreground">
            Plateforme d'analyse prédictive en santé publique
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Connexion</CardTitle>
            <CardDescription>
              Accédez à votre compte pour utiliser les outils d'analyse
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserLogin />
          </CardContent>
        </Card>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Button variant="ghost" asChild className="text-muted-foreground">
            <Link to="/" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Retour à l'accueil</span>
            </Link>
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-muted-foreground">
          <p>© 2024 AnalyzeIt - World Health Organization</p>
          <p>Plateforme sécurisée pour l'analyse de données de santé publique</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
