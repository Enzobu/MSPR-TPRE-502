import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

import { Loader2, Mail, Lock, LogIn } from 'lucide-react';

const UserLogin: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const signIn = useSignIn();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/swagger/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        const signInSuccess = signIn({
          auth: {
            token: data.access_token,
            type: "Bearer",
          },
          userState: {
            email: email,
          },
        });

        if (signInSuccess) {
          navigate("/");
        } else {
          setError("Erreur lors de la connexion");
        }
      } else {
        setError(data.message || "Identifiants incorrects");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-sm text-destructive font-medium">{error}</p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center space-x-2">
          <Mail className="h-4 w-4" />
          <span>Email</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="votre.email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="flex items-center space-x-2">
          <Lock className="h-4 w-4" />
          <span>Mot de passe</span>
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          className="w-full"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading}
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Connexion...
          </>
        ) : (
          <>
            <LogIn className="h-4 w-4 mr-2" />
            Se connecter
          </>
        )}
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        <p>Utilisez vos identifiants WHO pour accéder à la plateforme</p>
      </div>
    </form>
  );
};

export default UserLogin;
