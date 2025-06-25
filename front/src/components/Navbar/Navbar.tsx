import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import { Activity, User, Home, BarChart3 } from 'lucide-react';
import whoEmblem from '../../assets/who-emblem.svg';
import defaultAvatar from '../../assets/default-profile-avatar.png';
import useLoggedUser from '../../hooks/useLoggedUser';

const Navbar: React.FC = () => {
  const isAuthenticated = useIsAuthenticated();
  const { user } = useLoggedUser();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Accueil', icon: Home },
    { path: '/predictions', label: 'Prédictions', icon: BarChart3 },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo et titre */}
        <div className="flex items-center space-x-3">
          <img 
            src={whoEmblem} 
            alt="WHO Logo" 
            className="h-10 w-10"
          />
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-primary">AnalyzeIt</h1>
            <Badge variant="secondary" className="text-xs">
              <Activity className="mr-1 h-3 w-3" />
              WHO
            </Badge>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Button
              key={path}
              variant={isActive(path) ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link to={path} className="flex items-center space-x-2">
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            </Button>
          ))}
        </nav>

        {/* Profil utilisateur */}
        <div className="flex items-center space-x-3">
          {isAuthenticated && user ? (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/profile" className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={defaultAvatar} alt="Avatar" />
                  <AvatarFallback>
                    {user.firstname?.[0]}{user.lastname?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-sm font-medium">
                    {user.firstname} {user.lastname}
                  </span>
                  <Badge variant={user.isAdmin ? "default" : "secondary"} className="text-xs">
                    {user.isAdmin ? "Admin" : "Utilisateur"}
                  </Badge>
                </div>
              </Link>
            </Button>
          ) : (
            <Button variant="default" size="sm" asChild>
              <Link to="/login" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Connexion</span>
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Navigation mobile */}
      <div className="md:hidden border-t bg-background">
        <div className="container px-4 py-2">
          <nav className="flex justify-around">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Button
                key={path}
                variant={isActive(path) ? "default" : "ghost"}
                size="sm"
                asChild
                className="flex-1 mx-1"
              >
                <Link to={path} className="flex flex-col items-center space-y-1">
                  <Icon className="h-4 w-4" />
                  <span className="text-xs">{label}</span>
                </Link>
              </Button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar; 