import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Globe, Shield, Users, BarChart3, Activity } from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import whoBackground from '../../assets/who_background.jpg';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: TrendingUp,
      title: 'Prédictions Avancées',
      description: 'Algorithmes de machine learning pour des prédictions précises en santé publique',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    },
    {
      icon: Globe,
      title: 'Couverture Mondiale',
      description: 'Données et analyses pour plus de 190 pays à travers le monde',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
    },
    {
      icon: Shield,
      title: 'Sécurité des Données',
      description: 'Protection et confidentialité des données selon les standards WHO',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    },
    {
      icon: BarChart3,
      title: 'Visualisations Interactives',
      description: 'Graphiques et tableaux de bord pour une analyse approfondie',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden rounded-lg">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
            style={{ backgroundImage: `url(${whoBackground})` }}
          />
          <div className="relative z-10 container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto space-y-6">
              <Badge variant="outline" className="mb-4">
                <Activity className="h-3 w-3 mr-1" />
                Plateforme WHO
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                <span className="text-primary">AnalyzeIt</span>
                <br />
                <span className="text-muted-foreground">Prédictions Santé</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Plateforme d'analyse prédictive en santé publique utilisant l'intelligence artificielle 
                pour anticiper les tendances épidémiologiques mondiales.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button asChild size="lg" className="text-lg px-8 py-3">
                  <Link to="/predictions">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Commencer l'analyse
                  </Link>
                </Button>
                
                <Button variant="outline" size="lg" className="text-lg px-8 py-3" asChild>
                  <Link to="/profile">
                    <Users className="h-5 w-5 mr-2" />
                    Mon compte
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Fonctionnalités Principales</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Des outils puissants pour l'analyse et la prédiction en santé publique
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map(({ icon: Icon, title, description, color, bgColor }) => (
                <Card key={title} className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 mx-auto rounded-full ${bgColor} flex items-center justify-center mb-4`}>
                      <Icon className={`h-8 w-8 ${color}`} />
                    </div>
                    <CardTitle className="text-lg">{title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      {description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">190+</div>
                <div className="text-muted-foreground">Pays analysés</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">1M+</div>
                <div className="text-muted-foreground">Points de données</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">99.9%</div>
                <div className="text-muted-foreground">Précision des modèles</div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-20 bg-primary text-primary-foreground rounded-lg overflow-hidden">
          {/* Background animé */}
          <div className="absolute inset-0">
            {/* Gradient animé */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80"></div>
            
            {/* Cercles flottants */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
            <div className="absolute top-32 right-20 w-16 h-16 bg-white/5 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/15 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
            <div className="absolute bottom-32 right-1/3 w-24 h-24 bg-white/5 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
            
            {/* Formes géométriques flottantes */}
            <div className="absolute top-1/4 left-1/3 w-8 h-8 bg-white/10 rotate-45 animate-spin" style={{ animationDuration: '8s', animationDelay: '0.7s' }}></div>
            <div className="absolute bottom-1/3 right-1/4 w-6 h-6 bg-white/15 rotate-12 animate-ping" style={{ animationDelay: '1s' }}></div>
            
            {/* Vagues animées avec SVG */}
            <div className="absolute bottom-0 left-0 w-full h-24 opacity-20">
              <svg viewBox="0 0 1200 120" className="w-full h-full">
                <path 
                  d="M0,60 C150,90 300,30 450,60 C600,90 750,30 900,60 C1050,90 1200,30 1200,60 L1200,120 L0,120 Z" 
                  fill="currentColor"
                  className="animate-pulse"
                />
              </svg>
            </div>
            
            {/* Particules brillantes */}
            <div className="absolute top-1/2 left-1/5 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
            <div className="absolute top-1/3 right-1/5 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '0.7s' }}></div>
            <div className="absolute bottom-1/4 left-2/3 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '1.2s' }}></div>
            
            {/* Effet de lueur douce */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
          </div>
          
          {/* Contenu */}
          <div className="relative z-10 container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl font-bold transform transition-all duration-1000 hover:scale-105">
                Prêt à commencer votre analyse ?
              </h2>
              <p className="text-lg opacity-90 transform transition-all duration-1000 delay-200">
                Accédez à nos outils de prédiction et découvrez les tendances de santé publique
              </p>
              <div className="transform transition-all duration-1000 delay-400">
                <Button variant="secondary" size="lg" className="text-lg px-8 py-3 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm" asChild>
                  <Link to="/predictions">
                    <BarChart3 className="h-5 w-5 mr-2 animate-pulse" />
                    Lancer une prédiction
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default HomePage; 