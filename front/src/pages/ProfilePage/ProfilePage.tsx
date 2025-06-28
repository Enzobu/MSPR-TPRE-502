import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSignOut from "react-auth-kit/hooks/useSignOut";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Settings as SettingsIcon, Lock, Users, LogOut, Shield, UserCheck } from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import useLoggedUser from '../../hooks/useLoggedUser';
import UserProfile from '../../components/UserProfile/UserProfile';
import PasswordChange from '../../components/PasswordChange/PasswordChange';
import Settings from '../../components/Settings/Settings';
import AllUsers from '../../components/UserList/UserList';
import avatarIcon from '../../assets/default-profile-avatar.png';

type ActiveSection = "Informations" | "Mot de passe" | "Paramètres" | "Utilisateurs";

const ProfilePage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<ActiveSection>("Informations");
  const signOut = useSignOut();
  const navigate = useNavigate();
  const { user, loading, error } = useLoggedUser();

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  const renderSection = () => {
    switch (activeSection) {
      case "Informations":
        return <UserProfile />;
      case "Mot de passe":
        return <PasswordChange />;
      case "Paramètres":
        return <Settings />;
      case "Utilisateurs":
        return user?.isAdmin ? <AllUsers /> : (
          <div className="text-center py-8">
            <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">Accès refusé</h3>
            <p className="text-muted-foreground">Vous devez être administrateur pour accéder à cette section.</p>
          </div>
        );
      default:
        return null;
    }
  };

  const menuItems = [
    { 
      key: "Informations" as const, 
      label: "Informations personnelles", 
      icon: User,
      description: "Gérez vos informations de profil"
    },
    { 
      key: "Mot de passe" as const, 
      label: "Sécurité", 
      icon: Lock,
      description: "Modifiez votre mot de passe"
    },
         { 
       key: "Paramètres" as const, 
       label: "Préférences", 
       icon: SettingsIcon,
       description: "Configurez vos préférences"
     },
    ...(user?.isAdmin ? [{ 
      key: "Utilisateurs" as const, 
      label: "Gestion utilisateurs", 
      icon: Users,
      description: "Administrez les comptes utilisateurs"
    }] : []),
  ];

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Chargement de votre profil...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <Card className="max-w-md mx-auto border-destructive">
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="text-destructive text-2xl mb-4">⚠️</div>
                <h3 className="text-lg font-semibold text-destructive mb-2">Erreur de chargement</h3>
                <p className="text-muted-foreground">Une erreur est survenue : {error}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Profil utilisateur</h1>
          <p className="text-muted-foreground">Gérez vos informations personnelles et paramètres de compte</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader className="text-center pb-4">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={avatarIcon} alt="Avatar utilisateur" />
                    <AvatarFallback className="text-lg">
                      {user?.firstname?.[0]}{user?.lastname?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">
                      {user?.firstname} {user?.lastname}
                    </h3>
                    <Badge variant={user?.isAdmin ? "default" : "secondary"} className="flex items-center gap-1">
                      {user?.isAdmin ? <Shield className="h-3 w-3" /> : <UserCheck className="h-3 w-3" />}
                      {user?.isAdmin ? "Administrateur" : "Utilisateur"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <Separator />
              
              <CardContent className="p-0">
                <nav className="space-y-1 p-2">
                  {menuItems.map(({ key, label, icon: Icon, description }) => (
                    <Button
                      key={key}
                      variant={activeSection === key ? "default" : "ghost"}
                      className="w-full justify-start h-auto p-3"
                      onClick={() => setActiveSection(key)}
                    >
                      <div className="flex items-start space-x-3">
                        <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <div className="text-left">
                          <div className="font-medium">{label}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {description}
                          </div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </nav>
                
                <Separator />
                
                <div className="p-2">
                  <Button 
                    variant="destructive" 
                    className="w-full justify-start"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Se déconnecter
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contenu principal */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {(() => {
                    const activeItem = menuItems.find(item => item.key === activeSection);
                    const Icon = activeItem?.icon || User;
                    return (
                      <>
                        <Icon className="h-5 w-5" />
                        <span>{activeItem?.label}</span>
                      </>
                    );
                  })()}
                </CardTitle>
                <CardDescription>
                  {menuItems.find(item => item.key === activeSection)?.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderSection()}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
