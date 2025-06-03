import { useState } from "react";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import { useNavigate } from "react-router-dom";

const fetchLogin = async (
  email: string,
  password: string
): Promise<string | null> => {
  try {
    const res = await fetch(
      "http://enzo-palermo.com:5001/swagger/users/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    return data.access_token || null;
  } catch (err) {
    console.error("Erreur fetchLogin :", err);
    return null;
  }
};

const LoginComponent = () => {
  const signIn = useSignIn();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const token = await fetchLogin(email, password);

    if (token) {
      const success = signIn({
        auth: {
          token,
          type: "Bearer",
        },
        state: { email },
      } as any);

      if (success) {
        navigate("/profile");
      } else {
        alert("Erreur interne : impossible de stocker l'authentification.");
      }
    } else {
      alert("Email et/ou mot de passe incorrect");
    }
  };

  return (
    <div className="globalContainer">
      <form onSubmit={handleSubmit} className="loginForm">
        <div className="inputContainer">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            name="email"
            placeholder="Entrez votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="inputContainer">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            name="password"
            placeholder="Entrez votre mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="loginCTA">
          Sign in
        </button>
      </form>
    </div>
  );
};

export default LoginComponent;
